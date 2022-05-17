export interface Data {
  connection: {
    Id: string;
    Mode: string;
    PollingInterval: string;
    EnableOnlineImpedance: boolean;
    NotifiesBufferUpdates: boolean;
    NotifiesImpedanceUpdates: boolean;
    NotifiesSnrUpdates: boolean;
  };

  buffer: {
    Id: number;
    Data: number[];
  };
}
