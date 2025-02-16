export class NyxaEventBus extends EventTarget {
  private static events: Map<string, ((data: any) => void)[]> = new Map();

  private constructor() {
    super();
  }

  /**
   * Emit an event
   * @param event Event name
   * @param data Event data
   */
  static emit(event: string, data: any) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Register an event listener
   * @param event Event name
   * @param callback Callback function
   */
  static on(event: string, callback: (data: any) => void) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  /**
   * Remove an event listener
   * @param event Event name
   * @param callback Callback function
   */
  static off(event: string, callback: (data: any) => void) {
    if (this.events.has(event)) {
      this.events.set(event, this.events.get(event)!.filter(cb => cb !== callback));
    }
  }

  /**
   * Register an event listener that runs only once
   * @param event Event name
   * @param callback Callback function
   */
  static once(event: string, callback: (data: any) => void) {
    const wrapper = (data: any) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
