import { contains } from 'underscore';

import Event from './event';

export default class EventManager {
    constructor() {
        this.events = {};
    }

    add(evs) {
        for (let ev of evs) {
            this.events[ev.name] = new Event(
                ev.timer,
                ev.trigger,
                ev.repeats,
                ev.startPaused,
            );
        }
    }

    remove(ev) {
        if (!this.exists(ev)) {
            throw new Error(`Could not find event with tag "${ev}".`);
        }

        this.clear(ev);
        delete this.events[ev];
    }

    clear(ev) {
        if (!this.exists(ev)) {
            throw new Error(`Could not find event with tag "${ev}".`);
        }

        this.events[ev].clear();
    }

    clearAll() {
        for (let event of this.events) {
            event.clear();
        }
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