import { includes, without } from 'lodash';
import MapManager from '../src/spoopy/mapmanager';

describe('MapManager', () => {
  const available = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const others = ['b', 'c', 'd', 'e', 'f', 'g'];
  const target = new MapManager(available);

  describe('constructor', () => {
    test('accepts a list as a constructor arg and stores that list (as .available)', () => {
      expect(target.available).toEqual(available);
    });

    test('inits used list as empty', () => {
      expect(target.used).toHaveLength(0);
    });

    test('inits adjacency list as empty', () => {
      expect(target.adjacency).toEqual({});
    });

    test('inits item map to be empty', () => {
      expect(target.adjacency).toEqual({});
    });
  });

  describe('exists()', () => {
    beforeAll(() => {
      target.add('a');
    });

    afterAll(() => {
      target.used.map(item => target.remove(item));
    });

    test('returns true for an expected room', () => {
      expect(target.exists('a')).toEqual(true);
    });

    test('returns false for an invalid room', () => {
      expect(target.exists('abc')).toEqual(false);
    });
  });

  describe('find()', () => {
    beforeAll(() => {
      target.add('a');
    });

    afterAll(() => {
      target.used.map(item => target.remove(item));
    });

    test('throws error for an invalid room', () => {
      expect(() => target.find('abc')).toThrow(Error);
    });

    test('returns object with empty map & item lists for singleton room', () => {
      expect(target.find('a')).toEqual({
        adjacency: [],
        items: []
      });
    });
  });

  describe('add()', () => {
    beforeAll(() => {
      target.add('a');
    });

    afterAll(() => {
      target.used.map(item => target.remove(item));
    });

    test('adds new room successfully', () => {
      target.add('b');
      expect(target.adjacency).toEqual({
        a: [],
        b: []
      });
    });

    test('throws error if room already exists when adding', () => {
      expect(() => target.add('a')).toThrow(Error);
    });
  });

  describe('remove()', () => {
    beforeAll(() => {
      target.add('a');
    });

    afterAll(() => {
      target.used.map(item => target.remove(item));
    });

    test('throw error if room does not exist', () => {
      expect(() => target.remove('b')).toThrow(Error);
    });

    test('removes a valid room, clears relevant data and does not modify other data', () => {
      target.add('b');
      target.remove('b');

      expect(target.used).toContain('a');
      expect(target.adjacency.a).toHaveLength(0);
      expect(target.items.a).toHaveLength(0);

      expect(target.used).not.toContain('b');
      expect(target.adjacency.b).toEqual(undefined);
      expect(target.items.b).toEqual(undefined);
    });
  });

  describe('connect()', () => {
    beforeAll(() => {
      target.add('a');
      target.add('b');
      target.add('c');
    });

    afterAll(() => {
      target.used.map(item => target.remove(item));
    });

    test('throws error if <from> or <to> is undefined', () => {
      expect(() =>
        target.connect(
          'a',
          undefined
        )
      ).toThrow(Error);
      expect(() =>
        target.connect(
          undefined,
          'a'
        )
      ).toThrow(Error);
    });

    test('throws error if adjacency of <from> or <to> is undefined', () => {
      expect(() =>
        target.connect(
          'a',
          'ab'
        )
      ).toThrow(Error);
      expect(() =>
        target.connect(
          'ab',
          'a'
        )
      ).toThrow(Error);
    });

    test('updates <from> and <to> adjacency lists properly', () => {
      target.connect(
        'a',
        'b'
      );

      expect(target.find('a').adjacency).toEqual(['b']);
      expect(target.find('b').adjacency).toEqual(['a']);
      expect(target.find('c').adjacency).toHaveLength(0);
    });

    test('connects unidirectional passages correctly', () => {
      target.connect(
        'a',
        'c',
        true
      );

      expect(target.find('a').adjacency).toContain('c');
      expect(target.find('c').adjacency).toHaveLength(0);
    });
  });

  describe('place()', () => {
    beforeAll(() => {
      target.add('a');
    });

    afterAll(() => {
      target.used.map(item => target.remove(item));
    });

    test('places item in valid room', () => {
      target.place('item', 'a');
      expect(target.items.a).toContain('item');
    });

    test('throws error if room does not exist', () => {
      expect(() => target.place('item', 'ab')).toThrow(Error);
    });
  });

  describe('pickup()', () => {
    beforeAll(() => {
      target.add('a');
    });

    afterAll(() => {
      target.used.map(item => target.remove(item));
    });

    test('removes item from list if room exists', () => {
      target.place('item1', 'a');
      target.place('item2', 'a');
      target.pickup('item1', 'a');

      expect(target.items.a).toEqual(['item2']);
    });

    test('throws error if the item does not exist', () => {
      expect(() => target.pickup('item1', 'a')).toThrow(Error);
    });

    test('throws error if room does not exist', () => {
      expect(() => target.pickup('item1', 'ab')).toThrow(Error);
    });
  });

  describe('random()', () => {
    test('returns a (1) room within the current list given no params', () => {
      target.random().map(item => expect(available).toContain(item));
    });

    test('returns >1 rooms within current list given empty params', () => {
      target.random(4).map(item => expect(available).toContain(item));
    });

    test('returns a (1) room within params list', () => {
      const avail = ['ab', 'bc', 'cd'];
      target
        .random(1, {
          available: avail,
          operator: item => item !== 'ab'
        })
        .map(item => expect(avail).toContain(item));
    });

    test('returns >1 rooms within params list', () => {
      const avail = ['ab', 'bc', 'cd', 'ef'];
      target
        .random(3, {
          available: avail,
          operator: item => item !== 'ab'
        })
        .map(item => expect(avail).toContain(item));
    });

    test('returns undefined with current list given no params if none are available', () => {
      available.map(item => target.add(item));
      expect(target.random()).toBeUndefined();
      available.map(item => target.remove(item));
    });

    test('returns undefined with params if none are available', () => {
      const avail = ['ab', 'bc', 'cd'];
      expect(
        target.random(2, {
          available: avail,
          operator: item => !includes(avail, item)
        })
      ).toBeUndefined();
    });
  });

  describe('build()', () => {
    afterEach(() => {
      target.used.map(item => target.remove(item));
    });

    test('builds expected map with all nodes specified', () => {
      target.add('a');
      target.build('a', others.length);

      others.map(item => expect(target.adjacency.a).toContain(item));
      others.map(item => expect(target.adjacency[item]).toEqual(['a']));
    });

    test('builds expected map with subset of nodes specified', () => {
      target.add('a');
      target.build('a', 3);

      target.used.forEach(item => {
        if (item === 'a') {
          target.adjacency[item].map(sub => expect(others).toContain(sub));
        } else {
          expect(target.adjacency[item]).toEqual(['a']);
        }
      });
    });

    test('builds leaf-connected map with all nodes specified', () => {
      const connects = 1;
      const branches = 2;

      target.add('a');
      target.build('a', branches, connects);

      const picked = target.used;
      target.used.forEach(item => {
        if (item === 'a') {
          target.adjacency[item].forEach(sub => expect(picked).toContain(sub));
        } else {
          expect(target.adjacency[item].length).toEqual(2);
          expect(target.adjacency[item]).toEqual(without(picked, item));
        }
      });
    });

    test('builds no branches if list has nothing available', () => {
      available.map(item => target.add(item));
      target.build('a', 1);

      target.used.map(item => expect(target.adjacency[item].length).toEqual(0));
    });

    test('throws an error if start node does not exist', () => {
      expect(() => target.build('a', 1)).toThrow(Error);
    });
  });

  describe('generate()', () => {
    afterEach(() => {
      target.used.map(item => target.remove(item));
    });

    test('builds a map containing a subset of available nodes, simple case', () => {
      target.generate({
        start: {
          loc: 'a',
          min_branches: 2,
          max_branches: 2
        },

        branches: {
          generations: 1,
          min_branches: 1,
          max_branches: 1,
          connects: 0
        }
      });

      const { used } = target;
      const adj = target.adjacency;

      expect(target.used.length).toEqual(5);
      used.forEach(item => {
        if (item === 'a') {
          expect(adj[item].length).toEqual(2);
        } else {
          if (includes(adj.a, item)) {
            expect(adj[item].length).toEqual(2);
            expect(adj[item]).toContain('a');
          }

          // expect(adj[item].length).toEqual(1);
          expect([1, 2]).toContain(adj[item].length);
        }
      });
    });

    test('builds a map consisting of available nodes, non-simple case', () => {
      target.generate({
        start: {
          loc: 'a',
          min_branches: 2,
          max_branches: 3
        },

        branches: {
          generations: 1,
          min_branches: 0,
          max_branches: 1,
          connects: 1
        }
      });

      const { used } = target;
      const adj = target.adjacency;

      used.forEach(item => {
        if (item === 'a') {
          expect(adj[item].length).toBeGreaterThanOrEqual(2);
          expect(adj[item].length).toBeLessThanOrEqual(3);
        } else {
          if (includes(adj.a, item)) {
            expect(adj[item].length).toBeGreaterThanOrEqual(1);
            expect(adj[item].length).toBeLessThanOrEqual(3);
          }

          expect(adj[item].length).toBeGreaterThanOrEqual(1);
          expect(adj[item].length).toBeLessThanOrEqual(3);
        }
      });
    });

    test('stops building gracefully if we run out of rooms to generate', () => {
      target.generate({
        start: {
          loc: 'a',
          min_branches: 3,
          max_branches: 6
        },

        branches: {
          generations: 1,
          min_branches: 3,
          max_branches: 5,
          connects: 3
        }
      });

      const { used } = target;
      const adj = target.adjacency;

      used.forEach(item => {
        if (item === 'a') {
          expect(adj[item].length).toBeGreaterThanOrEqual(3);
          expect(adj[item].length).toBeLessThanOrEqual(6);
        } else {
          if (includes(adj.a, item)) {
            expect(adj[item].length).toBeGreaterThanOrEqual(1);
            expect(adj[item].length).toBeLessThanOrEqual(6);
          }

          expect(adj[item].length).toBeGreaterThanOrEqual(1);
          expect(adj[item].length).toBeLessThanOrEqual(4);
        }
      });
    });
  });
});
