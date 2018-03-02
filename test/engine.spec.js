import Engine from '../src/spoopy/engine';

import Player from '../src/spoopy/player';
import ItemDB from '../src/spoopy/items';
import RoomDB from '../src/spoopy/rooms';
import EventManager from '../src/spoopy/eventmanager';
import MapManager from '../src/spoopy/mapmanager';

describe('Engine', () => {
    let target;

    describe('constructor', () => {
        beforeEach(() => {
            target = new Engine({
                start: {
                    loc: 'Foyer',
                    min_branches: 3,
                    max_branches: 6,
                },
                branches: {
                    min_branches: 1,
                    max_branches: 3,
                    connects: 2,
                    generations: 1,
                },
            });
        });
        
        test('inits Engine instance to expected parameters', () => {
            expect(target.player).toBeInstanceOf(Player);
            expect(target.itemDB).toBeInstanceOf(ItemDB);
            expect(target.roomDB).toBeInstanceOf(RoomDB);
            expect(target.mapManager).toBeInstanceOf(MapManager);
            expect(target.eventManager).toBeInstanceOf(EventManager);

            expect(target.GUIState).toHaveProperty('propDescription');
            expect(target.GUIState).toHaveProperty('propLocation');
            expect(target.GUIState).toHaveProperty('propButtonGridActions');
            expect(target.GUIState).toHaveProperty('propButtonGridExits');
            expect(target.GUIState).toHaveProperty('propHealth');
            expect(target.GUIState).toHaveProperty('propInventory');
            expect(target.GUIState).toHaveProperty('propBattery');
            expect(target.GUIState).toHaveProperty('propClock');

            expect(target._playerActions).toBeTruthy();
        });
    });

    describe('updateGUIState()', () => {
        beforeEach(() => {
            target = new Engine({
                start: {
                    loc: 'Foyer',
                    min_branches: 3,
                    max_branches: 6,
                },
                branches: {
                    min_branches: 1,
                    max_branches: 3,
                    connects: 2,
                    generations: 1,
                },
            });
        });

        test('initial state is correct', () => {
            const GUIState = target.GUIState;

            expect(GUIState).toHaveProperty('propDescription', 'You can\'t really make out too much standing here.');
            expect(GUIState).toHaveProperty('propLocation', 'A dark and indistinct room');

            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toBe(1);

            expect(GUIState).toHaveProperty('propButtonGridExits');
            expect(GUIState.propButtonGridExits.length).toBeGreaterThanOrEqual(1);

            expect(GUIState).toHaveProperty('propHealth', 'You feel perfectly healthy.');
            expect(GUIState).toHaveProperty('propInventory', 'Your pockets are quite empty.');
            expect(GUIState).toHaveProperty('propBattery', 'Your phone\'s battery is full.');
            
            // note propClock is not yet implemented - we're not checking much here
            // TODO: once propClock is implemented, rewrite this test
            expect(GUIState).toHaveProperty('propClock', undefined);
        });
    });
});