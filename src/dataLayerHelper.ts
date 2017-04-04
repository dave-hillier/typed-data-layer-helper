export interface DataLayerEvent {
  [key: string]: string|string[]|number|number[]|object|object[]; // TODO: is this just any? not null?
}

class DataLayerHelper {
  private readonly unprocessed: DataLayerEvent[] = [];
  private inCallback: boolean;

  private processUpdates(updates: DataLayerEvent[], callback: (arg: DataLayerEvent) => void) {
    // This function could be re-entrant if the callback pushes something onto the datalayer, 
    // which is why unprocessed is a member and we guard 
    this.unprocessed.push(...updates);
    while (!this.inCallback && this.unprocessed.length > 0) {
      const update = this.unprocessed.shift();
      this.inCallback = true;
      callback(update);
      this.inCallback = false;
    }
  }

  public subscribe(dataLayer: DataLayerEvent[], callback: (arg: DataLayerEvent) => void, listenToHistory: boolean) {
    const oldPush = dataLayer.push;

    if (listenToHistory) {
      this.processUpdates(dataLayer, callback);
    }
    dataLayer.push = (...args) => {
      const result = oldPush.apply(dataLayer, args);
      this.processUpdates(args, callback);
      return result;
    };
  }
}

export function subscribe(dataLayer: DataLayerEvent[], callback: (arg: DataLayerEvent) => void, listenToHistory: boolean = true) {
  const helper = new DataLayerHelper();
  helper.subscribe(dataLayer, callback, listenToHistory);
}
