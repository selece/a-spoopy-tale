import { expect } from 'chai';
import { contains, without } from 'underscore';

import EventManager from './eventmanager';

describe('EventManager', () => {
    let target = new EventManager();

    describe('constructor', () => {
        it('inits an empty object for events', () => {
            expect(target.events).to.be.empty;
        });

        it('produces an object of type EventManager', () => {
            expect(target instanceof EventManager);
        });
    });
});