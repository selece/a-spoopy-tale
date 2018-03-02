import Player from '../src/spoopy/player';

describe('Player', () => {
    let target;

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
            expect(target.currentInventoryDescription).toMatch(/pockets are quite empty/);
        });

        test('returns singleton list for ["Skull"]', () => {
            target.pickupItem('Skull');
            expect(target.currentInventoryDescription).toBe(
                'You are currently holding: a Skull.'
            );
        });

        test('returns singleton list for ["Apple"]', () => {
            target.pickupItem('Apple');
            expect(target.currentInventoryDescription).toBe(
                'You are currently holding: an Apple.'
            );
        });

        test('returns multiple item list for ["Apple", "Skull"]', () => {
            target.pickupItem('Apple');
            target.pickupItem('Skull');
            expect(target.currentInventoryDescription).toBe(
                'You are currently holding: an Apple and a Skull.'
            );
        });

        test('returns multiple item list for ["Apple", "Skull", "Pop"]', () => {
            target.pickupItem('Apple');
            target.pickupItem('Skull');
            target.pickupItem('Pop');
            expect(target.currentInventoryDescription).toBe(
                'You are currently holding: an Apple, a Skull, and a Pop.'
            );
        });
    });

    describe('get currentBatteryDescription()', () => {
        beforeEach(() => {
            target = new Player();
        });

        test('returns "Your phone\'s battery is full." when battery is 100', () => {
            expect(target.currentBatteryDescription).toBe('Your phone\'s battery is full.');
        });

        test('returns "Boop!" when battery is not full', () => {
            target.battery = 50;
            expect(target.currentBatteryDescription).toBe('Boop!');
        });
    });

    describe('get currentHealthDescription()', () => {
        beforeEach(() => {
            target = new Player();
        });

        test('returns "You feel perfectly healthy" when health is 100', () => {
            expect(target.currentHealthDescription).toBe('You feel perfectly healthy.');
        });

        test('returns "Welp." when health is not full', () => {
            target.health = 50;
            expect(target.currentHealthDescription).toBe('Welp.');
        });
    });

    describe('modifyHealth()', () => {
        beforeEach(() => {
            target = new Player();
        });

        test('does not modify on a zero input', () => {
            target.modifyHealth(0);
            expect(target.health).toBe(100);
        });

        test('adds expected amount on positive input', () =>  {
            target.modifyHealth(100);
            expect(target.health).toBe(200);
        });

        test('subtracts expected amount on negative input', () => {
            target.modifyHealth(-50);
            expect(target.health).toBe(50);
        });

        test('throws error on non-integer input', () => {
            expect(() => target.modifyHealth('Bad')).toThrowError(/Expected integer/);
        });
    });

    describe('modifyBattery()', () => {
        beforeEach(() => {
            target = new Player();
        });

        test('does not modify on a zero input', () => {
            target.modifyBattery(0);
            expect(target.battery).toBe(100);
        });

        test('adds expected amount on positive input', () =>  {
            target.modifyBattery(100);
            expect(target.battery).toBe(200);
        });

        test('subtracts expected amount on negative input', () => {
            target.modifyBattery(-50);
            expect(target.battery).toBe(50);
        });

        test('throws error on non-integer input', () => {
            expect(() => target.modifyBattery('Bad')).toThrowError(/Expected integer/);
        });
    });

    describe('pickupItem()', () => {
        beforeEach(() => {
            target = new Player();
        });

        test('adds items to the player inventory', () => {
            target.pickupItem('Skull');
            expect(target.inventory).toEqual(['Skull']);
        });
    });

    describe('dropItem()', () => {
        beforeEach(() => {
            target = new Player();
            target.pickupItem('Skull');
        });

        test('drops items from the player inventory', () => {
            target.dropItem('Skull')
            expect(target.inventory).toEqual([]);
        });

        test('throws error if player has no such item', () => {
            expect(() => target.dropItem('Bad')).toThrowError(/Player does not have/);
        });
    });

    describe('hasItem()', () => {
        beforeEach(() => {
            target = new Player();
            target.pickupItem('Skull');
        });

        test('returns true for items in inventory', () => {
            expect(target.hasItem('Skull')).toBe(true);
        });

        test('throws error if player has no such item', () => {
            expect(target.hasItem('Bad')).toBe(false);
        });
    });

    describe('hasVisited()', () => {
        beforeEach(() => {
            target = new Player();
        });

        test('returns true for visited rooms', () => {
            expect(target.hasVisited('Foyer')).toBe(true);
        });

        test('throws false for unvisited rooms', () => {
            expect(target.hasVisited('Other')).toBe(false);
        });
    });

    describe('hasExplored()', () => {
        beforeEach(() => {
            target = new Player();
            target.updateExplored('Foyer');
        });

        test('returns true for explored rooms', () => {
            expect(target.hasExplored('Foyer')).toBe(true);
        });

        test('throws false for unexplored rooms', () => {
            expect(target.hasExplored('Other')).toBe(false);
        });
    });

    describe('hasSearched()', () => {
        beforeEach(() => {
            target = new Player();
            target.updateSearched('Foyer');
        });

        test('returns true for searched rooms', () => {
            expect(target.hasSearched('Foyer')).toBe(true);
        });

        test('throws false for unsearched rooms', () => {
            expect(target.hasSearched('Other')).toBe(false);
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

    describe('updateExplored()', () => {
        beforeEach(() => {
            target = new Player();
        });

        test('adds new rooms to map (visited)', () => {
            target.updateExplored('Foyer');
            expect(target.explored).toEqual(['Foyer']);
        });

        test('does not add rooms that exist already to map (visited)', () => {
            target.updateExplored('Foyer');
            target.updateExplored('Foyer');
            expect(target.explored).toEqual(['Foyer']);
        });
    });

    describe('updateSearched()', () => {
        beforeEach(() => {
            target = new Player();
        });

        test('adds new rooms to map (visited)', () => {
            target.updateSearched('Foyer');
            expect(target.searched).toEqual(['Foyer']);
        });

        test('does not add rooms that exist already to map (visited)', () => {
            target.updateSearched('Foyer');
            target.updateSearched('Foyer');
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
            expect(target.loc).toBe('Foyer');
            expect(target.map).toEqual(['Foyer']);
        });

        test('moving to new location updates loc & map vars', () => {
            target.move('Other');
            expect(target.loc).toBe('Other');
            expect(target.map).toEqual(['Foyer', 'Other']);
        });
    });
});