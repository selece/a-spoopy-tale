import Player from './player';

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
    });

    describe('get currentBatteryDescription()', () => {

    });

    describe('get currentBattery()', () => {

    });

    describe('get currentHealthDescription()', () => {

    });

    describe('get currentHealth()', () => {

    });

    describe('get currentSearched()', () => {

    });

    describe('get currentMap()', () => {

    });

    describe('get currentExplored()', () => {

    });

    describe('get currentInventory()', () => {

    });

    describe('get currentLocation()', () => {

    });

    describe('modifyHealth()', () => {

    });

    describe('modifyBattery()', () => {

    });

    describe('pickupItem()', () => {

    });

    describe('dropItem()', () => {

    });

    describe('hasItem()', () => {

    });

    describe('hasVisited()', () => {

    });

    describe('hasExplored()', () => {

    });

    describe('hasSearched()', () => {

    });

    describe('updateMap()', () => {

    });

    describe('updateExplored()', () => {

    });

    describe('updateSearched()', () => {

    });

    describe('move()', () => {

    });
});