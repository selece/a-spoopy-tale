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

    describe('exists', () => {
        test('returns false when event is not found', () => {
            expect(target.exists('fake')).toBe(false);
        });

        test('returns true when event is found', () => {
            target.add([props]);
            expect(target.exists('Test')).toBe(true);
            target.remove('Test');
        });
    });

    describe('find', () => {
        test('throws error if tag does not exist', () => {
            expect(() => target.find('fake')).toThrowError(/Could not find event/);
        });

        test('returns event object if tag is found', () => {
            target.add([props]);
            let local = target.find('Test');

            expect(local).toHaveProperty('timer', 5);
            expect(local).toHaveProperty('onDone', spy);
            expect(local).toHaveProperty('repeats', false);
            expect(local).toHaveProperty('paused', false);
        });
    })

    describe('add', () => {
        test('adds the specified event to the list', () => {
            target.add([props]);
            let local = target.events['Test'];

            expect(local).toHaveProperty('timer', 5);
            expect(local).toHaveProperty('onDone', spy);
            expect(local).toHaveProperty('paused', false);
            expect(local).toHaveProperty('repeats', false);
        });
    });

    describe('remove', () => {
        test('removes the specified test from the list', () => {
            target = new EventManager();
            target.add([props]);
            target.remove('Test');

            expect(target.events).toEqual({});
        });

        test('throws error if tag does not exist for event', () => {
            expect(() => target.remove('fake')).toThrowError(/Could not find event/);
        });
    });

    describe('clear', () => {
        test('throws error if tag does not exists for event', () => {
            expect(() => target.clear('fake')).toThrowError(/Could not find event/);
        });
    });

    describe('clearAll', () => {
        test(' -- test not yet written -- ');
    });
});