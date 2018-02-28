import Event from './event';

jest.useFakeTimers();

describe('Event', () => {
    const timer = 5;
    const spy = jest.fn();
    let target = new Event(timer, spy, false, false);

    describe('constructor', () => {
        test('returns an object of type Event', () => {
            expect(target instanceof Event);
        });

        test('inits all parameters to expected values', () => {
            expect(target.initial).toBe(timer);
            expect(target.onDone).toBe(spy);
            expect(target.repeats).toBe(false);
            expect(target.paused).toBe(false);
        });
    });

    describe('toggle', () => {
        test('flips the value of paused', () => {
            const current = target.paused;
            target.toggle();

            expect(target.paused).toBe(!current);
        });
    });

    describe('add', () => {
        test('increments the timer by the specified amount', () => {
            const current = target.timer
            target.add(timer);
            expect(target.timer).toEqual(current + timer);
        });
    });

    describe('subtract', () => {
        test('decrements the timer by the specified amount', () => {
            const current = target.timer;
            target.subtract(timer);
            expect(target.timer).toEqual(current - timer);
        });
    });

    describe('reset', () => {
        test('restores the timer to the initial value', () => {
            target.add(100);
            target.reset();
            expect(target.timer).toEqual(timer);
        });
    });

    describe('clear', () => {
        test(' -- tests not yet written -- ');
    });

    describe('tick', () => {
        beforeEach(() => {
            target = new Event(5, spy);
        });

        test('spy is only called after timer <= 0', () => {
            jest.runTimersToTime(5000);

            expect(target.timer).toBe(0);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test('spy is called repeatedly for repeating events', () => {
            const localSpy = jest.fn();
            const local = new Event(5, localSpy, true);

            // initial state
            expect(local.timer).toBe(5);
            expect(localSpy).toHaveBeenCalledTimes(0);

            // t=5000ms 
            jest.runTimersToTime(5000);
            expect(local.timer).toBe(5);
            expect(localSpy).toHaveBeenCalledTimes(1);

            // t=10000ms
            // NOTE: 3 times due to previous jest.runTimersToTime(5000) in previous test?
            jest.runTimersToTime(10000);
            expect(local.timer).toBe(5);
            expect(localSpy).toHaveBeenCalledTimes(3);

            local.clear();
        });
    });
});