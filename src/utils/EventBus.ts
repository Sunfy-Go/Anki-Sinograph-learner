type EventCallback<T> = (payload: T) => void;

export class EventBus<T> {
    private eventMap = new Map<T, EventCallback<any>[]>();

    public addEvent<E>(eventName: T, callback: EventCallback<E>) {
        if (this.eventMap.has(eventName) === false) {
            this.eventMap.set(eventName, []);
        }
        this.eventMap.get(eventName)!.push(callback);
    }

    public removeEvent<E>(eventName: T, callback: EventCallback<E>) {
        if (this.eventMap.has(eventName) === false) return;

        const callbacks = this.eventMap.get(eventName);
        if (callbacks === undefined) return;

        const updateCallbacks = callbacks.filter(cb => cb !== callback);
        if (updateCallbacks.length === 0) {
            this.eventMap.delete(eventName);
            return;
        }
        this.eventMap.set(eventName, updateCallbacks);
    }

    public emitEvent<E>(eventName: T, payload: E) {
        if (this.eventMap.has(eventName) === false) return;
        const callbacks = this.eventMap.get(eventName);
        callbacks?.forEach(cb => cb(payload));
    }

    public clearAllEvent() {
        this.eventMap.clear();
    }
}