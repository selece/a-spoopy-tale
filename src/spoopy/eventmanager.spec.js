import { contains, without } from 'underscore';

import EventManager from './eventmanager';

jest.useFakeTimers();

describe('EventManager', () => {
    let target = new EventManager();
    let spy = jest.fn();
    let props = {
        name: 'Test',
        timer: 5,
        trigger: spy,
        repeats: false,
        startPaused: false,
    };

    describe('constructor', () => {
        test('inits an empty object for events', () => {
            expect(target.events).toEqual({});
        });

        test('produces an object of type EventManager', () => {
            expect(target instanceof EventManager);
        });
    });

    describe('add', () => {
        test('adds the specified event to the list', () => {
            target.add([props]);
            let local = target.events['Test'];

            expect(local.timer).toBe(5);
            expect(local.onDone).toBe(spy);
            expect(local.repeats).toBe(false);
            expect(local.paused).toBe(false);
        });
    });

    describe('remove', () => {
        test('removes the specified test from the list', () => {
            target = new EventManager();
            target.add([props]);
            target.remove('Test');

            expect(target.events).toEqual({});
        });
    });
});