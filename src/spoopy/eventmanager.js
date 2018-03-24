'use strict';

import Event from './event';

export default class EventManager {
    constructor() {
        this.events = {};
    }

    add(events) {
        events.forEach(ev => {
            this.events[ev.name] = new Event(
                ev.timer,
                ev.trigger,
                ev.repeats,
                ev.startPaused,
            )
        });
    }

    remove(ev) {
        if (!this.exists(ev)) {
            throw new Error(`Could not find event with tag "${ev}".`);
        }

        delete this.events[ev];
    }

    exists(ev) {
        return this.events[ev] === undefined ? false : true;
    } 

    find(ev) {
        if (!this.exists(ev)) {
            throw new Error(`Could not find event with tag "${ev}".`);
        }

        return this.events[ev];
    }
}