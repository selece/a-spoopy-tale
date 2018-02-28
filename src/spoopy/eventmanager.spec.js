import { contains, without } from 'underscore';

import EventManager from './eventmanager';

describe('EventManager', () => {
    let target = new EventManager();

    describe('constructor', () => {
        test('inits an empty object for events', () => {
            expect(target.events).toEqual({});
        });

        test('produces an object of type EventManager', () => {
            expect(target instanceof EventManager);
        });
    });
});