import { expect } from 'chai';
import { isFunction } from 'underscore';
import sinon from 'sinon';

import Event from './event';

describe('Event', () => {
    let clock = sinon.useFakeTimers();

    const timer = 10;
    let target = new Event(timer, () => {});
    let spyOnDone = sinon.spy(target, 'onDone');
    let spyTick = sinon.spy(target, 'tick');

    describe('constructor', () => {
        it('returns an object of type Event', () => {
            expect(target instanceof Event);
        });

        it('inits all parameters to expected values', () => {
            expect(target.initial).to.equal(timer);
            expect(isFunction(target.onDone)).to.be.true;
            expect(target.repeats).to.equal(false);
            expect(target.paused).to.equal(false);
        });
    });

    describe('toggle', () => {
        it('flips the value of paused', () => {
            const current = target.paused;
            target.toggle();

            expect(target.paused).to.equal(!current);
        });
    });

    describe('add', () => {
        it(' -- tests not yet written -- ');
    });

    describe('subtract', () => {
        it(' -- tests not yet written -- ');
    });

    describe('reset', () => {
        it(' -- tests not yet written -- ');
    });

    describe('clear', () => {
        it(' -- tests not yet written -- ');
    });

    describe('tick', () => {
        after(() => {
            clock.restore();
        });

        it('calls onDone only after the timer is passed', () => {
            expect(spyOnDone.called).to.be.false;
            clock.tick(15 * 1000);
            expect(spyOnDone.called).to.be.true;
        });
    });
});