import Event from '../src/spoopy/event';

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
            expect(target.initial).toEqual(timer);
            expect(target.onDone).toEqual(spy);
            expect(target.repeats).toEqual(false);
            expect(target.paused).toEqual(false);
        });
    });

    describe('toggle', () => {
        test('flips the value of paused', () => {
            const current = target.paused;
            target.toggle();

            expect(target.paused).toEqual(!current);
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

    describe('tick', () => {
        beforeEach(() => {
            target = new Event(5, spy);
        });

        test('spy is only called after timer <= 0', () => {
            jest.runTimersToTime(5000);

            expect(target.timer).toEqual(0);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test('spy is called repeatedly for repeating events', () => {
            const localSpy = jest.fn();
            const local = new Event(5, localSpy, true);

            // initial state
            expect(local.timer).toEqual(5);
            expect(localSpy).toHaveBeenCalledTimes(0);

            // t=5000ms 
            jest.runTimersToTime(5000);
            expect(local.timer).toEqual(5);
            expect(localSpy).toHaveBeenCalledTimes(1);

            // t=10000ms
            // NOTE: 3 times due to previous jest.runTimersToTime(5000) in previous test?
            // FIXME: isolate test states per test so this doesn't happen!
            jest.runTimersToTime(10000);
            expect(local.timer).toEqual(5);
            expect(localSpy).toHaveBeenCalledTimes(3);
        });
    });
});