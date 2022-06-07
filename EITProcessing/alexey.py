import numpy as np
import requests
from contextlib import closing
import csv
from codecs import iterdecode
from websocket import WebSocketApp
import json
from queue import Queue, SimpleQueue, Empty
from threading import Thread, Timer, Event
from sched import scheduler
import time
from argparse import ArgumentParser
import sys
import math
import neuronic_eit_labview as nel
import io
from PIL import Image
from PIL.PngImagePlugin import PngInfo


def _print(frame: list):
    frame = np.array(frame, dtype=np.float)
    frame = np.reshape(frame, newshape=(math.floor(math.sqrt(frame.size)), -1))
    print(frame)


def _print_frames(frames):
    np.set_printoptions(precision=2, threshold=sys.maxsize, suppress=True, linewidth=sys.maxsize)
    for frame in frames:
        _print(frame)
        print('-------------------------------------------------------------------------------------------------------')


def _process(frame: list, rate):
    frame = np.array(frame, dtype=float)
    frame = np.reshape(frame, newshape=(math.floor(math.sqrt(frame.size)), -1))
    try:
        image, tidal_img, area, breathing_rate, scale_min, scale_max = nel.tomograph_iteration(
            frame, rate=rate, Nrow=2, Ncol=2
        )
        return {
            "image": image,
            "tidal_img": tidal_img,
            "area": area,
            "breathing_rate": breathing_rate,
            "scale_min": scale_min,
            "scale_max": scale_max
        }
    except Exception as e:
        print("[ProcError]: ", e)


def _send_image(ws: WebSocketApp, image: Image, metadata: dict = None):
    try:
        image = np.asarray(image)
        image[np.isnan(image)] = 0
        image[image > 1] = 1
        image = 255 * image
        image = Image.fromarray(image.astype(int))
        info = PngInfo()
        if isinstance(metadata, dict):
            for key, value in metadata.items():
                info.add_text(key, value)

        with io.BytesIO() as mem:
            image.save(mem, format='PNG', pnginfo=info)
            mem.seek(0)
            ws.send(mem.read(), opcode=0x2)
    except Exception as e:
        print("[ImgError]: ", e)


def _process_frames(frames, ws: WebSocketApp, rate=20):
    nel.setup(args=(rate,))
    for idx, frame in enumerate(frames):
        result = _process(frame, rate)
        image = result.pop('image')
        tidal_img = result.pop('tidal_img')
        result["idx"] = idx
        txt = json.dumps(result)
        print(txt)
        print('-------------------------------------------------------------------------------------------------------')
        ws.send(txt)
        #_send_image(ws, image,
        #            metadata={"Type": "Image", "Frame": str(idx)})
        #_send_image(ws, tidal_img,
        #            metadata={"Type": "Tidal Image", "Frame": str(idx)})


def _consume(queue: Queue):
    while True:
        f = queue.get()
        if f is None:
            return
        yield f


def _stream(url: str):
    while True:
        try:
            with closing(requests.get(url, stream=True)) as r:
                lines = iterdecode(r.iter_lines(), 'utf-8')
                reader = csv.reader(lines, delimiter=',', quotechar='"')
                next(reader)  # Skip header
                for row in reader:
                    yield row[1:]
                return
        except TimeoutError:
            pass
        except Exception as e:
            print("[StreamError]: ", e)
            return


def _is_recording(url: str, timeout):
    try:
        obj = requests.get(url, timeout=timeout).json()
        return obj['Mode'] == 'Recording'
    except TimeoutError:
        return False


def _check_connection(url: str, interval: float):
    run = Event()

    def make_request(t):
        if _is_recording(url, timeout=interval / 2):
            run.set()
        elif run.is_set():
            run.clear()
            return
        s.enterabs(t + interval, 1, make_request, argument=(t + interval,))

    s = scheduler(time.time, time.sleep)
    s.enter(0, 1, make_request, argument=(time.time(),))

    Thread(target=s.run, daemon=True).start()

    return run


def _poll_frames(url: str, interval: float, run: Event):
    queue = Queue()
    s = scheduler(time.time, time.sleep)

    def wait_to_start():
        run.wait()
        s.enter(0, 1, make_request, argument=(time.time(), -1))
        s.run()

    def make_request(t, frame_id):
        if not run.is_set():
            queue.task_done()
            return
        try:
            obj = requests.get(url, timeout=interval / 2).json()
            if frame_id < obj['Id']:
                queue.put(obj['Data'])
                frame_id = obj['Id']
        except TimeoutError:
            pass
        except Exception as e:
            print("[HTTPError]: ", e)
        s.enterabs(t + interval, 1, make_request, argument=(t + interval, frame_id))

    Thread(target=wait_to_start, daemon=True).start()

    return _consume(queue)


def display(http_url: str,
            ws_url: str,
            out_url: str,
            cid: str,
            stream: bool,
            poll_freq: float,
            rate: float):
    run = Event()
    queue = None
    ws = None

    def on_open(ws):
        if _is_recording(f'http://{http_url}/connections/{cid}', timeout=0.1):
            run.set()
        else:
            run.clear()

    def on_error(ws, error):
        print("[WsError]: ", error)

    def on_event(ws, message):
        obj = json.loads(message)
        name, obj = next(iter(obj.items()))
        if name == 'DataReceived':
            frame = obj['buffer']["Data"]
            queue and queue.put(frame)
        elif name == 'Started':
            run.set()
        elif name == 'Stopped':
            run.clear()
            if queue is not None:
                queue.put(None)
                queue.task_done()

    if http_url and stream:
        frames = _stream(f'http://{http_url}/connections/{cid}/stream')
    elif http_url and poll_freq > 0:
        interval = 1 / poll_freq
        if ws_url:
            ws = WebSocketApp(f'ws://{ws_url}',
                              on_open=on_open,
                              on_error=on_error,
                              on_message=on_event)
            Thread(target=ws.run_forever, daemon=True).start()
        else:
            run = _check_connection(url=f'http://{http_url}/connections/{cid}', interval=interval)
        frames = _poll_frames(f'http://{http_url}/connections/{cid}/buffer', interval=interval, run=run)
    elif ws_url:
        queue = Queue()
        ws = WebSocketApp(f'ws://{ws_url}',
                          on_error=on_error,
                          on_message=on_event)
        Thread(target=ws.run_forever, daemon=True).start()
        frames = _consume(queue)
    else:
        raise Exception('Nothing to display')

    # Replace processing down here
    if out_url:
        out_ws = WebSocketApp(f'ws://localhost:3003/',
                              on_error=on_error)
        Thread(target=out_ws.run_forever, daemon=True).start()
        _process_frames(frames, out_ws, rate=rate)
    else:
        _print_frames(frames)

    ws is not None and ws.close()


def display_forever(http_url: str,
                    ws_url: str,
                    out_url: str,
                    cid: str,
                    stream: bool,
                    poll_freq: float,
                    rate: float):
    while True:
        display(http_url=http_url,
                ws_url=ws_url,
                out_url=out_url,
                cid=cid,
                stream=stream,
                poll_freq=poll_freq,
                rate=rate)


if __name__ == '__main__':
    parser = ArgumentParser(description='Display received EIT data frames.')
    parser.add_argument('--http', type=str, default='localhost:8348/api', help='Base URL of the HTTP server.')
    parser.add_argument('--ws', type=str, default='localhost:8348/ws/connections', help='Base URL of the Websocket server.')
    parser.add_argument('--out', type=str, help='Base URL of the output Websocket server.')
    parser.add_argument('--connection', required=True, type=str, help='ID of the connection.')
    parser.add_argument('--stream', action='store_true', help='Try to receive frames through the streaming endpoint.')
    parser.add_argument('--rate', type=float, default=20, help='The frame rate.')
    parser.add_argument('--poll', type=float, default=0, help='Poll the current frame with a fixed frequency.')
    parser.add_argument('--repeat', action='store_true', help='Restart listening after finishing recording.')
    args = parser.parse_args()

    finished = Event()

    def display_and_exit():
        try:
            if args.repeat:
                display_forever(http_url=args.http,
                                ws_url=args.ws,
                                out_url=args.out,
                                cid=args.connection,
                                stream=args.stream,
                                poll_freq=args.poll,
                                rate=args.rate)
            else:
                display(http_url=args.http,
                        ws_url=args.ws,
                        out_url=args.out,
                        cid=args.connection,
                        stream=args.stream,
                        poll_freq=args.poll,
                        rate=args.rate)
        finally:
            finished.set()

    def read_loop():
        print('Processing frames...')
        sys.stdin.read()
        finished.set()

    Thread(target=display_and_exit, daemon=True).start()
    Thread(target=read_loop, daemon=True).start()

    finished.wait()
    print('DONE!')


