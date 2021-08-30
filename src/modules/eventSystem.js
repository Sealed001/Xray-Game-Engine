class EventSystemModule {
    init() {
        this._eventSystemEvents = [];
        this.setTimeout = function(callback, time, args = []) {
            this._eventSystemEvents.push({
                callback,
                args,
                time: this.time + time
            });
        }
    }

    onUpdate() {
        // Launch Events
        this._eventSystemEvents = Array.from(this._eventSystemEvents, (event, eventIndex) => {
            if (event.time <= this.time) {
                event.callback(...event.args);
            } else {
                return event;
            }
        });
    }
}

module.exports = EventSystemModule;