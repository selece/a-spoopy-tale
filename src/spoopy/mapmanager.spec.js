import { expect, should } from 'chai';
import { contains, without } from 'underscore';

import MapManager from './mapmanager';


describe('MapManager', () => {
    const available = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const others = ['b', 'c', 'd', 'e', 'f', 'g'];
    let target = new MapManager(available);

    describe('constructor', () => {
        it('accepts a list as a constructor arg and stores that list (as .available)', () => {
            expect(target.available === available);
        });

        it('inits used list as empty', () => {
            expect(target.used).to.be.empty;
        });

        it('inits adjacency list as empty', () => {
            expect(target.adjacency).to.be.empty;
        });

        it('inits item map to be empty', () => {
            expect(target.adjacency).to.be.empty;
        });
    });

    describe('exists()', () => {
        before(() => {
            target.add('a');
        });

        after(() => {
            target.used.map(item => target.remove(item));
        });

        it('returns true for an expected room', () => {
            expect(target.exists('a')).to.equal(true);
        });

        it('returns false for an invalid room', () => {
            expect(target.exists('abc')).to.equal(false);
        });
    });

    describe('find()', () => {
        before(() => {
            target.add('a');
        });

        after(() => {
            target.used.map(item => target.remove(item));
        });

        it('throws error for an invalid room', () => {
            expect(() => target.find('abc')).to.throw(Error, /Cannot find room/);
        });

        it('returns object with empty map & item lists for singleton room', () => {
            expect(target.find('a')).to.eql({
                map: [],
                items: [],
            });
        });
    });

    describe('add()', () => {
        before(() => {
            target.add('a');
        });

        after(() => {
            target.used.map(item => target.remove(item));
        });

        it('adds new room successfully', () => {
            target.add('b');
            expect(target.adjacency).to.eql({
                'a': [],
                'b': [],
            });
        });

        it('throws error if room already exists when adding', () => {
            expect(() => target.add('a')).to.throw(Error, /Room already exists/);
        });
    });

    describe('remove()', () => {
        before(() => {
            target.add('a');
        });

        after(() => {
            target.used.map(item => target.remove(item));
        });

        it('throw error if room does not exist', () => {
            expect(() => target.remove('b')).to.throw(Error, /Room does not exist/);
        });

        it('removes a valid room, clears relevant data and does not modify other data', () => {
            target.add('b');
            target.remove('b');

            expect(target.used).to.contain('a');
            expect(target.adjacency['a']).to.be.empty;
            expect(target.items['a']).to.be.empty;

            expect(target.used).to.not.contain('b');
            expect(target.adjacency['b']).to.equal(undefined);
            expect(target.items['b']).to.equal(undefined);
        });
    });

    describe('connect()', () => {
        before(() => {
            target.add('a');
            target.add('b');
            target.add('c');
        });

        after(() => {
            target.used.map(item => target.remove(item));
        });

        it('throws error if <from> or <to> is undefined', () => {
            expect(() => target.connect('a', undefined)).to.throw(Error, /Cannot connect/);
            expect(() => target.connect(undefined, 'a')).to.throw(Error, /Cannot connect/);
        });

        it('throws error if adjacency of <from> or <to> is undefined', () => {
            expect(() => target.connect('a', 'ab')).to.throw(Error, /Cannot connect/);
            expect(() => target.connect('ab', 'a')).to.throw(Error, /Cannot connect/);
        });

        it('updates <from> and <to> adjacency lists properly', () => {
            target.connect('a', 'b');
 
            expect(target.find('a').map).to.eql(['b']);
            expect(target.find('b').map).to.eql(['a']);
            expect(target.find('c').map).to.be.empty;
        });
    });

    describe('place()', () => {
        before(() => {
            target.add('a');
        });

        after(() => {
            target.used.map(item => target.remove(item));
        });

        it('places item in valid room', () => {
            target.place('item', 'a');
            expect(target.items['a']).to.contain('item');
        });

        it('throws error if room does not exist', () => {
            expect(() => target.place('item', 'ab')).to.throw(Error, /Cannot place/);
        });
    });

    describe('pickup()', () => {
        before(() => {
            target.add('a');
        });

        after(() => {
            target.used.map(item => target.remove(item));
        });

        it('removes item from list if room exists', () => {
            target.place('item1', 'a');
            target.place('item2', 'a');
            target.pickup('item1', 'a');

            expect(target.items['a']).to.eql(['item2']);
        });

        it('throws error if the item does not exist', () => {
            expect(() => target.pickup('item1', 'a')).to.throw(Error, /not found at/);
        });

        it('throws error if room does not exist', () => {
            expect(() => target.pickup('item1', 'ab')).to.throw(Error, /Cannot pickup/);
        });
    });

    describe('random()', () => {
        it('returns a (1) room within the current list given no params', () => {
            target.random().map(item => expect(available).to.contain(item));
        });

        it('returns >1 rooms within current list given empty params', () => {
            target.random(4).map(item => expect(available).to.contain(item));
        });

        it('returns a (1) room within params list', () => {
            let avail = ['ab', 'bc', 'cd']
            target.random(1, {
                available: avail,
                operator: item => item !== 'ab',
            }).map(item => expect(avail).to.contain(item));
        });

        it('returns >1 rooms within params list', () => {
            let avail = ['ab', 'bc', 'cd', 'ef'];
            target.random(3, {
                available: avail,
                operator: item => item !== 'ab',
            }).map(item => expect(avail).to.contain(item));
        });

        it('returns undefined with current list given no params if none are available', () => {
            available.map(item => target.add(item));
            expect(target.random()).to.be.undefined;
            available.map(item => target.remove(item));
        });

        it('returns undefined with params if none are available', () => {
            let avail = ['ab', 'bc', 'cd'];
            expect(target.random(2, {
                available: avail,
                operator: item => !contains(avail, item)
            })).to.be.undefined;
        });
    });

    describe('build()', () => {
        afterEach(() => {
            target.used.map(item => target.remove(item));
        });

        it('builds expected map with all nodes specified', () => {
            target.add('a');
            target.build('a', others.length);

            others.map(item => expect(target.adjacency['a']).to.contain(item));
            others.map(item => expect(target.adjacency[item]).to.eql(['a']));
        });

        it('builds expected map with subset of nodes specified', () => {
            target.add('a');
            target.build('a', 3);

            target.used.map(
                item => {
                    if (item === 'a') {
                        target.adjacency[item].map(sub => expect(others).to.contain(sub));
                    } else {
                        expect(target.adjacency[item]).to.eql(['a']);
                    }
                }
            );
        });

        it('builds leaf-connected map with all nodes specified', () => {
            const connects = 1, branches = 2;
            target.add('a');
            target.build('a', branches, connects);

            const picked = target.used;

            target.used.map(
                item => {
                    if (item === 'a') {
                        target.adjacency[item].map(sub => expect(picked).to.contain(sub));
                    } else {
                        expect(target.adjacency[item].length).to.equal(2);
                        expect(target.adjacency[item]).to.eql(without(picked, item));
                    }
                }
            );
        });

        it('throws an error if start node does not exist', () => {
            expect(() => target.build('a', 1)).to.throw(Error, /Can't build at/);
        });
    });

    describe('generate()', () => {
        it(' -- tests not yet written -- ');
    });
});