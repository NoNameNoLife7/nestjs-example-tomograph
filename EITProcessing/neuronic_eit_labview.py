import numpy as np
from math import floor
from scipy.signal import find_peaks, peak_prominences
import pyeit.mesh as mesh
import pyeit.eit.bp as bp
import pyeit.eit.greit as greit
import pyeit.eit.jac as jac
from pyeit.eit.interp2d import sim2pts
from pyeit.eit.utils import eit_scan_lines
from scipy.interpolate import griddata
from pyeit.mesh.shape import thorax

# from pyeit.mesh.shape import thorax


# guardar marco de tiempo de tamanho K
p = -1  # last iterator index in buffer
t = -1  # count of frames

rate = 0  # frames/second rate
Nbuff = 0
frames_buffer = None
images_buffer = None

last_max_frame_index = None  # index of the last maximum frame
last_ref_frame_index = 0

img = np.zeros(shape=(64, 64), dtype=int)

min_prominence = 0
max_prominence = 0

min_count = 0  # number of values averaged
min_average = None  # number of minimum averaged

max_count = 0  # number of values averaged
max_average = 0  # number of maximum averaged

ref_frame = None  # reference frame
max_frame = None

ref_image = None
max_image = None

norm_min = 0  # used for normalize the image
norm_max = 10  # used for normalize the image
norm_max_temp = None

tidal_image = None


el_dist = 1
step = 1
# mesh_obj, el_pos = mesh.layer_circle()
mesh_obj, el_pos = mesh.create(16, h0=0.1, fd=thorax)
mesh_points = mesh_obj['node']
mesh_triangles = mesh_obj['element']
ex_mat = eit_scan_lines(16, el_dist)  # estimulation

image_x_pixels = 64
image_y_pixels = 64

eit = None  # object EIT

"""
    BP=0
    Jac=1
"""
INVERSE_SOLUTION_METHOD = 1

"""
Absolute Min-Max = 0
Last Respiration Min-Max = 1
Fast Update Min-Max = 2
"""
UPDATE_PEAKS_METHOD = 2


def setup(args):
    """
    Creates a buffer of frames with space for 2, times the rate.
    Creates an eit object for impedance processing.
    """
    global eit, frames_buffer, images_buffer, rate, Nbuff, INVERSE_SOLUTION_METHOD, image_x_pixels, image_y_pixels
    from time import time

    # Initialize the buffer
    rate = args[0]
    Nbuff = rate*10
    frames_buffer = np.zeros(shape=(208, Nbuff), dtype=float)
    images_buffer = np.zeros(shape=(Nbuff, image_x_pixels, image_y_pixels))

    # Initialize the eit method
    t1 = time()
    if INVERSE_SOLUTION_METHOD == 0:
        eit = bp.BP(mesh_obj, el_pos, ex_mat=ex_mat, step=step, parser='std')
        eit.setup(weight='none')
    elif INVERSE_SOLUTION_METHOD == 1:
        eit = jac.JAC(mesh_obj, el_pos, ex_mat=ex_mat, step=step, perm=1., parser='std')
        eit.setup(p=0.5, lamb=0.01, method='kotre')
    # eit = greit.GREIT(mesh_obj, el_pos, ex_mat=ex_mat, step=step, parser='std')
    # eit.setup(p=0.50, lamb=0.001)

    t2 = time()
    print("Create EIT setup", t2-t1)


def define_matrix():
    global mesh_points
    mesh_x_min = np.min(mesh_points[:, 0])
    mesh_x_max = np.max(mesh_points[:, 0])
    mesh_width = mesh_x_max - mesh_x_min

    mesh_y_min = np.min(mesh_points[:, 1])
    mesh_y_max = np.max(mesh_points[:, 1])
    mesh_height = mesh_y_max - mesh_y_min

    x = np.linspace(mesh_x_min, mesh_x_max, image_x_pixels, endpoint=True)
    # y = np.linspace(mesh_y_min, mesh_y_max, image_y_pixels, endpoint=True)
    y_center = (mesh_y_max + mesh_y_min) / 2
    y = np.linspace(y_center - mesh_width/2, y_center + mesh_width/2, image_y_pixels, endpoint=True)

    points = np.array(np.meshgrid(x, y)).reshape((2, 64*64)).T
    print(points.shape)
    return points


interpolation_points = define_matrix()


def calc_image(frame, reference):
    global ex_mat, mesh_obj, eit, fig, ax, INVERSE_SOLUTION_METHOD
    from time import time, sleep
    t0 = time()  # start

    if INVERSE_SOLUTION_METHOD == 0:
        ds = eit.solve(frame, reference, normalize=True)
        ds_n = ds
    elif INVERSE_SOLUTION_METHOD == 1:
        ds = eit.solve(frame, reference, normalize=True)
        ds_n = sim2pts(mesh_points, mesh_triangles, np.real(ds))
        pass

    t1 = time()  # solved inverse

    # print(mesh_points.shape, ds_n.shape, interpolation_points.shape)
    interpolation_values = griddata(mesh_points, ds_n, interpolation_points, method='cubic')
    # print(interpolation_values.shape)
    image = interpolation_values.reshape((64, 64,))
    t2 = time()
    print('solve inverse:', t1-t0)
    print('create image', t2-t1)
    return image


def calc_max_and_min_prominence(frames):
    """
    Calculates the prominence of all frames
    Attributes
    ----------
    frames : numpy array CxF (C: number of channels per frame; F: number of frames)

    Returns
    -------
    minima : int
        index of the frame with minimum prominence
    maxima : int
        index of the frame with maximum prominence
    pmin : int
        minimum prominence
    pmax : int
        maximum prominence
    """

    minima, maxima, pmin, pmax = None, None, None, None
    mean_curve = np.mean(frames, axis=0)

    min_peaks, min_prominences = get_prominence(mean_curve, inverse=True)
    if len(min_prominences) > 0:
        pmin = np.min(min_prominences)
        pmin = min_prominences[-1]
        minima = min_peaks[np.argmin(min_prominences)]

    max_peaks, maxs_prominences = get_prominence(mean_curve)
    if len(maxs_prominences) > 0:
        pmax = np.max(maxs_prominences)
        pmax = maxs_prominences[-1]
        maxima = max_peaks[np.argmax(maxs_prominences)]

    # print(min_peaks, min_prominences)
    # print(max_peaks, maxs_prominences)
    # print(pmin, minima)
    # print(pmax, maxima)

    return minima, maxima, pmin, pmax


def get_prominence(x, inverse=False):
    x = x if not inverse else x*-1
    peaks, _ = find_peaks(x)
    prominences = peak_prominences(x, peaks)[0]
    return peaks, prominences


def __filter_frame(frames, Nwind):
    """
    frames: numpy array
    breathing_rate : number
    return: array with shape len(frames) - breathing_rate + 1
    """
    fvd = np.convolve(frames, np.ones(Nwind), 'valid') / Nwind

    return fvd


def filter_frames(frames_buffer, Nwind):
    result = np.array([__filter_frame(frames_buffer[i, :], Nwind) for i in range(frames_buffer.shape[0])])
    return result


def calc_rois(frame, rows, cols):
    square_height = int(frame.shape[0] / rows)
    square_width = int(frame.shape[1] / cols)

    rois = np.zeros((rows, cols))
    for i in range(rows):
        for j in range(cols):
            row_last = frame.shape[0] if i == rows-1 else (i+1)*square_height
            col_last = frame.shape[1] if j == cols-1 else (j+1)*square_width
            square = frame[i*square_height: row_last, j*square_width: col_last]
            rois[i, j] = np.nansum(square)

    return rois


def index_in_time(x):
    """
    maps an index of a value in the filtered buffer, to the real index of the value in time

    Params:
    ______
    x: int
    the index in the filtered buffer
    """
    global Nbuff
    Nwind = rate
    result = t - Nbuff + floor(Nwind / 2) + x
    if result < 0:
        raise Exception("index cannot be smaller than 0")
    return result


def from_time_to_buffer_index(x):
    global Nbuff
    result = Nbuff - (t - x)
    return result


def tomograph_iteration(frame, Nbuff=None, threshold_period=None, rate=None, Nrow=None, Ncol=None):
    """
    Parameters
    ----------
        frame : array
            frame of electrical impedance signals
        Nbuff : int
            Buffer size
        threshold_period : number
            ...
        rate : number
            frames per second rate
        Nrow : number
            rows for image partitions
        Ncol : number
            rows for image partitions
    Returns
    _______
        image : matrix
            image calculated
        tidal_image : matrix
            tidal image
    """
    global p, t, frames_buffer, images_buffer, last_max_frame_index, last_ref_frame_index, \
        img, min_prominence, max_prominence, \
        min_average, max_average, ref_frame, max_frame, min_count, max_count, tidal_image, \
        norm_min, norm_max, norm_max_temp, ref_image, max_image

    threshold_period = rate
    Nbuff = frames_buffer.shape[1]

    frame = np.array(frame)
    frame = clean_frame_data(frame)

    image, refall, area = None, None, None
    if p < Nbuff - 1:
        p = p+1
    t = t + 1

    # shift frames and images buffer
    # if t >= Nbuff:
    #     frames_buffer[:, : -1] = frames_buffer[:, 1:]
    #     images_buffer[0: Nbuff-1] = images_buffer[1:Nbuff]
    # store the new frame
    frames_buffer[:, : -1] = frames_buffer[:, 1:]
    images_buffer[0: Nbuff - 1] = images_buffer[1:Nbuff]
    frames_buffer[:, -1] = frame

    new_max = False  # if there is a new tidal image
    new_ref = False   # if there is a new ref image
    breathing_rate = 0

    if ref_frame is None:
        ref_frame = frame

    filtered_frames = None

    if p >= Nbuff - 1:
        Nwind = rate  # int(rate * 1.5)
        filtered_frames = filter_frames(frames_buffer, Nwind)
        minima, maxima, pmin, pmax = calc_max_and_min_prominence(filtered_frames)

        if minima:
            if min_average is None:
                min_count = min_count + 1
                min_average = pmin
                # last_ref_frame_index = t - p + minima + floor(Nwind / 2)
                last_ref_frame_index = index_in_time(minima)
                ref_frame = filtered_frames[:, minima]
                new_ref = True
                print("Iteration:", t, "new reference in time index:", last_ref_frame_index)
            elif t - p + minima + floor(Nwind / 2) - last_ref_frame_index > threshold_period: # and min_average / 5 < pmin:
                min_count = min_count + 1
                min_average = (pmin + min_average * (min_count - 1)) / min_count
                last_ref_frame_index = index_in_time(minima)
                ref_frame = filtered_frames[:, minima]
                new_ref = True
                print("Iteration:", t, "new reference in time index:", last_ref_frame_index)
        if maxima:
            # pass
            if t - Nbuff + maxima + floor(Nwind / 2) > last_ref_frame_index: # and max_average / 10 < pmax:
                max_count = max_count + 1
                # new_max = t - Nbuff + maxima - floor(Nwind / 2)
                new_max = index_in_time(maxima)
                if last_max_frame_index is None:
                    last_max_frame_index = new_max
                    max_frame = filtered_frames[:, maxima]
                    new_max = True
                elif last_max_frame_index < new_max:
                    breathing_rate = 60 / ((new_max - last_max_frame_index) / rate)
                    last_max_frame_index = new_max
                    max_frame = filtered_frames[:, maxima]
                    new_max = True
                max_average = (pmax + max_average * (max_count - 1)) / max_count

    if new_ref:
        ref_index = from_time_to_buffer_index(last_ref_frame_index)
        ref_image = images_buffer[ref_index]
        norm_min = np.nanmin(ref_image)

    if new_max:
        max_index = from_time_to_buffer_index(last_max_frame_index)
        max_image = images_buffer[max_index]
        norm_max = np.nanmax(max_image)
        tidal_image = max_image - ref_image
        print("New Tid", "ref", last_ref_frame_index, "max", last_max_frame_index)
        print("max_index", max_index)

    # Calc Inverse solution
    # image = calc_image(frame, ref_frame)
    if t > Nbuff:
        image = calc_image(filtered_frames[:, -1], ref_frame)
        images_buffer[p] = image
    else:
        image = calc_image(frame, ref_frame)
        images_buffer[p] = image

    image_rois = calc_rois(image, Nrow, Ncol)
    total_image_rois = np.sum(image_rois)

    area = image_rois.reshape((Ncol*Nrow,)).tolist()
    area = [total_image_rois] + area
    print("area:", area)

    # Normalize image
    if t > Nbuff:
        # image = normalize_image(image)
        pass

    # Rotate
    image = np.rot90(image) * -1
    image = image.tolist()

    tidal_img = np.zeros((64, 64)) if tidal_image is None else (np.rot90(tidal_image) * -1)
    tidal_img = tidal_img.tolist()

    # scale_min, scale_max = 0, 10
    scale_min, scale_max = norm_min, norm_max
    return image, tidal_img, area, breathing_rate, scale_min, scale_max


def clean_frame_data(frame_data):
    frame = np.zeros((16, 13))
    for i in range(16):
        frame[i] = np.roll(frame_data[i], -(2+i))[0:13]
    # print(frame)
    frame = frame.reshape((208,))

    # min = np.min(frame)
    # frame = frame - min
    # max = np.max(frame)
    # frame = frame / max
    return frame


def clean_frame_data2(frame_data):
    frame = np.zeros((16, 13))
    for i in range(16):
        frame0 = frame_data[i*16:(i+1)*16]
        frame0 = np.roll(frame0, -(2+i))[0:13]
        frame[i] = frame0
    # print(frame)
    frame = frame.reshape((208,))

    # min = np.min(frame)
    # frame = frame - min
    # max = np.max(frame)
    # frame = frame / max
    return frame


def normalize_image(image):
    global norm_min, norm_max
    # return image
    lower = norm_min
    higher = norm_max
    if higher is None:
        higher = np.nanmax(image)
    norm_image = (image - lower)/(higher - lower) * 100
    return norm_image


def _test_real_data():
    from time import time
    import pandas as pd

    data_to_save = []
    SHOW_IMAGE = True
    SAVE_DATA = False

    data = pd.read_excel("Chedi_frames_only.xlsx").to_numpy()
    # print(data.shape) # (30688, 16) # 30688/(16) = 1918.0

    n = 1900
    rate = 15
    t0 = time()
    setup(args=(rate,))
    t1 = time()
    print("Create setup:", t1 - t0)
    # parar aqui
    if SHOW_IMAGE:
        import matplotlib.pyplot as plt
        from matplotlib.gridspec import GridSpec
        plt.ion()
        fig = plt.figure(figsize=(12, 8))
        gs = GridSpec(2, 2, figure=fig)
        ax0 = fig.add_subplot(gs[0, 0])
        ax1 = fig.add_subplot(gs[0, 1])
        ax2 = fig.add_subplot(gs[1, :])

        array = np.zeros(shape=(64, 64), dtype=np.uint8)
        axim = ax0.imshow(array, vmin=0, vmax=1500, cmap="Purples")
        axtid = ax1.imshow(array, vmin=0, vmax=1500, cmap="Purples")
        axbuffer, = ax2.plot(np.mean(frames_buffer, axis=0))
        fig.colorbar(axim, ax=ax0)
        fig.colorbar(axtid, ax=ax1)
        ax0.set_xlabel("Frame:")
        ax0.set_xlabel("Tidal Image")
        del array

    for i in range(n):
        t2 = time()
        print()
        print("Iteration:", i)

        frame = data[i*16:(i+1)*16, 0:16].tolist()

        image, tidal_img, area, breathing_rate, scale_min, scale_max = tomograph_iteration(
            frame,
            rate=rate,
            Nrow=2,
            Ncol=2
        )

        if SAVE_DATA:
            data_to_save.append({"iteration": i,
                                 "areas": area})

        image = np.array(image)
        if tidal_img is not None:
            tidal_img = np.array(tidal_img)

        if SHOW_IMAGE:
            # image = image - np.min(image)
            # image = image/np.max(image)
            # vmin = np.nanmin(image)
            # vmax = np.nanmax(image)
            vmin = scale_min
            vmax = scale_max
            # vmin = np.nanmin(ref_frame)
            # vmax = np.nanmax(max_frame) if max_frame is not None else np.nanmax(frame)
            # vmin = norm_min
            # vmax = norm_max
            print(vmin, vmax)
            # rotate image
            image = np.rot90(image)
            axim.set_data(image)
            axim.set_clim(vmin, vmax)
            ax0.set_xlabel("Frame: " + str(i))

            if tidal_img is not None:
                tidal_img = np.rot90(tidal_img)
                axtid.set_data(tidal_img)
                axtid.set_clim(vmin, vmax)

            ax2.clear()
            frames_curve = np.mean(frames_buffer, axis=0)
            ax2.plot(frames_curve)

            ref_index = from_time_to_buffer_index(last_ref_frame_index)
            if 0 < ref_index < Nbuff:
                ax2.scatter([ref_index], [frames_curve[ref_index]], c='green')

            if last_max_frame_index is not None:
                max_index = from_time_to_buffer_index(last_max_frame_index)
                if 0 < ref_index < Nbuff:
                    ax2.scatter([max_index], [frames_curve[max_index]], c='red')

            fig.canvas.flush_events()

        t3 = time()
        print("image mean", np.nanmean(image))
        # print("image\n", image)
        print("Iteration", i, "time:", t3 - t2)

    t4 = time()
    print()
    print("OverAll Time:", t4 - t1)

#    if SAVE_DATA:
#        import json
#        json_data = json.dumps(data_to_save)
#        with open("tomograph_output.json", 'w') as fs:
#            fs.write(json_data)


if __name__ == "__main__":
    _test_real_data()



