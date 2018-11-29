import Player from '../src/spoopy/player';

describe('Player', () => {
  let target;
  const skull = {
    name: 'Skull',
    descriptions: [
      {
        text:
          'The hollow eyes and broken teeth leer at you with an oddly jovial grin.',
        conditions: {}
      },
      {
        text: '!!! CONDITIONAL TEST !!!',
        conditions: { atLoc: 'Foyer' }
      }
    ],
    actions: {},
    tags: {}
  };

  const apple = {
    name: 'Apple',
    descriptions: [
      {
        text: 'Shiny and red.',
        conditions: {}
      }
    ],
    actions: {},
    tags: {}
  };

  const pop = {
    name: 'Pop',
    descriptions: [
      {
        text: 'Fizzy.',
        conditions: {}
      }
    ],
    actions: {},
    tags: {}
  };

  describe('constructor', () => {
    test('takes no arguments, returns player with proper init values', () => {
      target = new Player();

      expect(target).toHaveProperty('loc', 'Foyer');
      expect(target).toHaveProperty('inventory', []);
      expect(target).toHaveProperty('map', ['Foyer']);
      expect(target).toHaveProperty('explored', []);
      expect(target).toHaveProperty('searched', []);
      expect(target).toHaveProperty('health', 100);
      expect(target).toHaveProperty('battery', 100);
    });
  });

  describe('get currentInventoryDescription()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('returns "Your pockets are quite empty." when inventory is empty', () => {
      expect(target.currentInventoryDescription).toMatch(
        /pockets are quite empty/
      );
    });

    test('returns singleton list for ["Skull"]', () => {
      target.pickup(skull);
      expect(target.currentInventoryDescription).toEqual(
        'You are currently holding: a Skull.'
      );
    });

    test('returns singleton list for ["Apple"]', () => {
      target.pickup(apple);
      expect(target.currentInventoryDescription).toEqual(
        'You are currently holding: an Apple.'
      );
    });

    test('returns multiple item list for ["Apple", "Skull"]', () => {
      target.pickup(apple);
      target.pickup(skull);

      expect(target.currentInventoryDescription).toEqual(
        'You are currently holding: an Apple and a Skull.'
      );
    });

    test('returns multiple item list for ["Apple", "Skull", "Pop"]', () => {
      target.pickup(apple);
      target.pickup(skull);
      target.pickup(pop);

      expect(target.currentInventoryDescription).toEqual(
        'You are currently holding: an Apple, a Skull, and a Pop.'
      );
    });
  });

  describe('get currentBatteryDescription()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('returns "Your phone\'s battery is full." when battery is 100', () => {
      expect(target.currentBatteryDescription).toEqual(
        "Your phone's battery is full."
      );
    });

    test('returns "Boop!" when battery is not full', () => {
      target.battery = 50;
      expect(target.currentBatteryDescription).toEqual('Boop!');
    });
  });

  describe('get currentHealthDescription()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('returns "You feel perfectly healthy" when health is 100', () => {
      expect(target.currentHealthDescription).toEqual(
        'You feel perfectly healthy.'
      );
    });

    test('returns "Welp." when health is not full', () => {
      target.health = 50;
      expect(target.currentHealthDescription).toEqual('Welp.');
    });
  });

  describe('modifyHealth()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('does not modify on a zero input', () => {
      target.modifyHealth(0);
      expect(target.health).toEqual(100);
    });

    test('adds expected amount on positive input', () => {
      target.modifyHealth(100);
      expect(target.health).toEqual(200);
    });

    test('subtracts expected amount on negative input', () => {
      target.modifyHealth(-50);
      expect(target.health).toEqual(50);
    });

    test('throws error on non-integer input', () => {
      expect(() => target.modifyHealth('Bad')).toThrow(/Expected number/);
    });
  });

  describe('modifyBattery()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('does not modify on a zero input', () => {
      target.modifyBattery(0);
      expect(target.battery).toEqual(100);
    });

    test('adds expected amount on positive input', () => {
      target.modifyBattery(100);
      expect(target.battery).toEqual(200);
    });

    test('subtracts expected amount on negative input', () => {
      target.modifyBattery(-50);
      expect(target.battery).toEqual(50);
    });

    test('throws error on non-integer input', () => {
      expect(() => target.modifyBattery('Bad')).toThrow(/Expected number/);
    });
  });

  describe('pickup()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('adds items to the player inventory', () => {
      target.pickup('Skull');
      expect(target.inventory).toEqual(['Skull']);
    });
  });

  describe('drop()', () => {
    beforeEach(() => {
      target = new Player();
      target.pickup('Skull');
    });

    test('drops items from the player inventory', () => {
      target.drop('Skull');
      expect(target.inventory).toEqual([]);
    });

    test('throws error if player has no such item', () => {
      expect(() => target.drop('Bad')).toThrow(/Player does not have/);
    });
  });

  describe('hasItem()', () => {
    beforeEach(() => {
      target = new Player();
      target.pickup('Skull');
    });

    test('returns true for items in inventory', () => {
      expect(target.hasItem('Skull')).toEqual(true);
    });

    test('throws error if player has no such item', () => {
      expect(target.hasItem('Bad')).toEqual(false);
    });
  });

  describe('hasVisited()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('returns true for visited rooms', () => {
      expect(target.hasVisited('Foyer')).toEqual(true);
    });

    test('throws false for unvisited rooms', () => {
      expect(target.hasVisited('Other')).toEqual(false);
    });
  });

  describe('hasExplored()', () => {
    beforeEach(() => {
      target = new Player();
      target.explore('Foyer');
    });

    test('returns true for explored rooms', () => {
      expect(target.hasExplored('Foyer')).toEqual(true);
    });

    test('throws false for unexplored rooms', () => {
      expect(target.hasExplored('Other')).toEqual(false);
    });
  });

  describe('hasSearched()', () => {
    beforeEach(() => {
      target = new Player();
      target.search('Foyer');
    });

    test('returns true for searched rooms', () => {
      expect(target.hasSearched('Foyer')).toEqual(true);
    });

    test('throws false for unsearched rooms', () => {
      expect(target.hasSearched('Other')).toEqual(false);
    });
  });

  describe('updateMap()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('adds new rooms to map (visited)', () => {
      // NOTE: Foyer is already there from constructor, default start loc
      target.updateMap('Other');
      expect(target.map).toEqual(['Foyer', 'Other']);
    });

    test('does not add rooms that exist already to map (visited)', () => {
      target.updateMap('Foyer');
      target.updateMap('Foyer');
      expect(target.map).toEqual(['Foyer']);
    });
  });

  describe('explore()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('adds new rooms to map (visited)', () => {
      target.explore('Foyer');
      expect(target.explored).toEqual(['Foyer']);
    });

    test('does not add rooms that exist already to map (visited)', () => {
      target.explore('Foyer');
      target.explore('Foyer');
      expect(target.explored).toEqual(['Foyer']);
    });
  });

  describe('search()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('adds new rooms to map (visited)', () => {
      target.search('Foyer');
      expect(target.searched).toEqual(['Foyer']);
    });

    test('does not add rooms that exist already to map (visited)', () => {
      target.search('Foyer');
      target.search('Foyer');
      expect(target.searched).toEqual(['Foyer']);
    });
  });

  describe('move()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('moving to current location does not update anything', () => {
      // NOTE: we start at Foyer from constructor (default start loc)
      target.move('Foyer');
      expect(target.loc).toEqual('Foyer');
      expect(target.map).toEqual(['Foyer']);
    });

    test('moving to new location updates loc & map vars', () => {
      target.move('Other');
      expect(target.loc).toEqual('Other');
      expect(target.map).toEqual(['Foyer', 'Other']);
    });
  });

  describe('get status()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('initial state is correct', () => {
      const res = target.status;

      expect(res).toEqual(
        expect.objectContaining({
          inventory: {
            descriptive: 'Your pockets are quite empty.',
            value: []
          },

          map: {
            value: ['Foyer']
          },

          explored: {
            value: []
          },

          searched: {
            value: []
          },

          health: {
            descriptive: 'You feel perfectly healthy.',
            value: 100
          },

          battery: {
            descriptive: "Your phone's battery is full.",
            value: 100
          },

          loc: {
            value: 'Foyer'
          },

          conditions: [
            {
              atLoc: 'Foyer'
            }
          ]
        })
      );
    });

    test('state is correct after move', () => {
      target.move('Room');
      const res = target.status;

      expect(res).toEqual(
        expect.objectContaining({
          inventory: {
            descriptive: 'Your pockets are quite empty.',
            value: []
          },

          map: {
            value: ['Foyer', 'Room']
          },

          explored: {
            value: []
          },

          searched: {
            value: []
          },

          health: {
            descriptive: 'You feel perfectly healthy.',
            value: 100
          },

          battery: {
            descriptive: "Your phone's battery is full.",
            value: 100
          },

          loc: {
            value: 'Room'
          },

          conditions: [
            {
              atLoc: 'Room'
            }
          ]
        })
      );
    });

    test('state is correct after pickup', () => {
      target.pickup(skull);
      const res = target.status;

      expect(res).toEqual(
        expect.objectContaining({
          inventory: {
            descriptive: 'You are currently holding: a Skull.',
            value: [skull]
          },

          map: {
            value: ['Foyer']
          },

          explored: {
            value: []
          },

          searched: {
            value: []
          },

          health: {
            descriptive: 'You feel perfectly healthy.',
            value: 100
          },

          battery: {
            descriptive: "Your phone's battery is full.",
            value: 100
          },

          loc: {
            value: 'Foyer'
          },

          conditions: [
            {
              atLoc: 'Foyer'
            },
            {
              hasItem: 'Skull'
            }
          ]
        })
      );
    });

    test('state is correct after move and pickups', () => {
      target.pickup(skull);
      target.move('Room');
      const res = target.status;

      expect(res).toEqual(
        expect.objectContaining({
          inventory: {
            descriptive: 'You are currently holding: a Skull.',
            value: [skull]
          },

          map: {
            value: ['Foyer', 'Room']
          },

          explored: {
            value: []
          },

          searched: {
            value: []
          },

          health: {
            descriptive: 'You feel perfectly healthy.',
            value: 100
          },

          battery: {
            descriptive: "Your phone's battery is full.",
            value: 100
          },

          loc: {
            value: 'Room'
          },

          conditions: [
            {
              atLoc: 'Room'
            },
            {
              hasItem: 'Skull'
            }
          ]
        })
      );
    });

    test('state is correct after health modification', () => {
      target.modifyHealth(-50);
      const res = target.status;

      expect(res).toEqual(
        expect.objectContaining({
          inventory: {
            descriptive: 'Your pockets are quite empty.',
            value: []
          },

          map: {
            value: ['Foyer']
          },

          explored: {
            value: []
          },

          searched: {
            value: []
          },

          health: {
            descriptive: 'Welp.',
            value: 50
          },

          battery: {
            descriptive: "Your phone's battery is full.",
            value: 100
          },

          loc: {
            value: 'Foyer'
          },

          conditions: [
            {
              atLoc: 'Foyer'
            }
          ]
        })
      );
    });

    test('state is correct after battery modification', () => {
      target.modifyBattery(-50);
      const res = target.status;

      expect(res).toEqual(
        expect.objectContaining({
          inventory: {
            descriptive: 'Your pockets are quite empty.',
            value: []
          },

          map: {
            value: ['Foyer']
          },

          explored: {
            value: []
          },

          searched: {
            value: []
          },

          health: {
            descriptive: 'You feel perfectly healthy.',
            value: 100
          },

          battery: {
            descriptive: 'Boop!',
            value: 50
          },

          loc: {
            value: 'Foyer'
          },

          conditions: [
            {
              atLoc: 'Foyer'
            }
          ]
        })
      );
    });
  });

  describe('get currentConditions()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('initial state is correct', () => {
      expect(target.currentConditions).toEqual(
        expect.arrayContaining([expect.objectContaining({ atLoc: 'Foyer' })])
      );
    });

    test('state is correct after move', () => {
      target.move('Room');

      expect(target.currentConditions).toEqual(
        expect.arrayContaining([expect.objectContaining({ atLoc: 'Room' })])
      );
    });

    test('state is correct after pickups', () => {
      target.pickup(skull);
      target.pickup(apple);
      target.pickup(pop);

      const res = target.currentConditions;

      expect(res).toEqual(
        expect.arrayContaining([expect.objectContaining({ hasItem: 'Skull' })])
      );

      expect(res).toEqual(
        expect.arrayContaining([expect.objectContaining({ hasItem: 'Apple' })])
      );

      expect(res).toEqual(
        expect.arrayContaining([expect.objectContaining({ hasItem: 'Pop' })])
      );

      expect(res).toEqual(
        expect.arrayContaining([expect.objectContaining({ atLoc: 'Foyer' })])
      );
    });

    test('state is correct after move and pickups', () => {
      target.pickup(skull);
      target.move('Room');

      const res = target.currentConditions;

      expect(res).toEqual(
        expect.arrayContaining([expect.objectContaining({ atLoc: 'Room' })])
      );

      expect(res).toEqual(
        expect.arrayContaining([expect.objectContaining({ hasItem: 'Skull' })])
      );
    });
  });

  describe('query()', () => {
    beforeEach(() => {
      target = new Player();
    });

    test('throws error if any of the conditions are invalid', () => {
      expect(() => target.query({ testProp: 'testValue' })).toThrow(
        /Invalid condition/
      );
    });

    describe('hasItem', () => {
      beforeEach(() => {
        target.pickup(skull);
      });

      test('returns true for valid item', () => {
        expect(target.query({ hasItem: 'Skull' })).toEqual(true);
      });

      test('returns false for invalid item', () => {
        expect(target.query({ hasItem: 'BAD' })).toEqual(false);
      });
    });

    describe('atLocation', () => {
      beforeEach(() => {
        target.move('Room');
      });

      test('returns true for current location', () => {
        expect(target.query({ atLocation: 'Room' })).toEqual(true);
      });

      test('returns false for any other location', () => {
        expect(target.query({ atLocation: 'Foyer' })).toEqual(false);
      });
    });

    describe('searchedLocation', () => {
      beforeEach(() => {
        target.search('Foyer');
      });

      test('returns true if player has searched there', () => {
        expect(target.query({ hasSearched: 'Foyer' })).toEqual(true);
      });

      test('returns false if player has not searched there', () => {
        expect(target.query({ hasSearched: 'Room' })).toEqual(false);
      });
    });

    describe('exploredLocation', () => {
      beforeEach(() => {
        target.explore('Foyer');
      });

      test('returns true if player has explored there', () => {
        expect(target.query({ hasExplored: 'Foyer' })).toEqual(true);
      });

      test('returns false if player has not explored there', () => {
        expect(target.query({ hasExplored: 'Room' })).toEqual(false);
      });
    });

    describe('visitedLocation', () => {
      beforeEach(() => {
        target.move('Room');
      });

      test('returns true if player has visited there', () => {
        expect(target.query({ hasVisited: 'Room' })).toEqual(true);
      });

      test('returns false if players have not visited there', () => {
        expect(target.query({ hasVisited: 'BAD' })).toEqual(false);
      });
    });

    describe('hasHealth', () => {
      test('returns true if health is equal to arg', () => {
        expect(target.query({ hasHealth: 100 })).toEqual(true);
      });

      test('returns false if health is not equal to arg', () => {
        expect(target.query({ hasHealth: 50 })).toEqual(false);
      });
    });

    describe('hasHealthGreaterThan', () => {
      test('returns true if health >= arg', () => {
        expect(target.query({ hasHealthGreaterThan: 100 })).toEqual(true);
      });

      test('returns false if health < arg', () => {
        expect(target.query({ hasHealthGreaterThan: 150 })).toEqual(false);
      });
    });

    describe('hasHealthLessThan', () => {
      test('returns true if health <= arg', () => {
        expect(target.query({ hasHealthLessThan: 100 })).toEqual(true);
      });

      test('returns false if healh > arg', () => {
        expect(target.query({ hasHealthLessThan: 50 })).toEqual(false);
      });
    });

    describe('hasBattery', () => {
      test('returns true if battery is equal to arg', () => {
        expect(target.query({ hasBattery: 100 })).toEqual(true);
      });

      test('returns false if battery is not equal to arg', () => {
        expect(target.query({ hasBattery: 50 })).toEqual(false);
      });
    });

    describe('hasBatteryGreaterThan', () => {
      test('returns true if battery >= arg', () => {
        expect(target.query({ hasBatteryGreaterThan: 50 })).toEqual(true);
      });

      test('returns false if battery < arg', () => {
        expect(target.query({ hasBatteryGreaterThan: 150 })).toEqual(false);
      });
    });

    describe('hasBatteryLessThan', () => {
      test('returns true if battery <= arg', () => {
        expect(target.query({ hasBatteryLessThan: 150 })).toEqual(true);
      });

      test('returns false if battery > arg', () => {
        expect(target.query({ hasBatteryLessThan: 50 })).toEqual(false);
      });
    });
  });
});
