import Engine from '../src/spoopy/engine';

import Player from '../src/spoopy/player';
import ItemDB from '../src/spoopy/items';
import RoomDB from '../src/spoopy/rooms';
import EventManager from '../src/spoopy/eventmanager';
import MapManager from '../src/spoopy/mapmanager';

describe('Engine', () => {
    let target;
    const params = {
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
    };

    describe('constructor', () => {
        beforeEach(() => {
            target = new Engine(params);
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
            target = new Engine(params);
        });

        test('initial state is correct', () => {
            const GUIState = target.GUIState;

            expect(GUIState).toHaveProperty('propDescription', 'You can\'t really make out too much standing here.');
            expect(GUIState).toHaveProperty('propLocation', 'A dark and indistinct room');

            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toEqual(1);

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

    describe('playerAction()', () => {
        beforeEach(() => {
            target = new Engine(params);

            // replace playerAction function targets with Jest mocks
            target.player.move = jest.fn();
            target.player.updateExplored = jest.fn();
            target.player.updateSearched = jest.fn();
            target.player.pickupItem = jest.fn();
            target.player.dropItem = jest.fn();
            target.mapManager.pickup = jest.fn();
            target.mapManager.place = jest.fn();
        });

        test('invalid actions throw an error', () => {
            expect(() => target.playerAction('INVALID', undefined)).toThrowError(/is not a valid action/);
        });

        test('invalid arg throws an error', () => {
            expect(() => target.playerAction('PLAYER_MOVE', undefined)).toThrowError(/valid parameter/);
            expect(() => target.playerAction('PLAYER_MOVE', null)).toThrowError(/valid parameter/);
            expect(() => target.playerAction('PLAYER_MOVE', 0)).toThrowError(/valid parameter/);
        });

        test('responds to PLAYER_MOVE', () => {
            target.playerAction('PLAYER_MOVE', {loc: 'Test'});

            expect(target.player.move.mock.calls.length).toEqual(1);
            expect(target.player.move.mock.calls[0][0]).toEqual('Test');
         });

        test('responds to PLAYER_EXPLORE', () => {
            target.playerAction('PLAYER_EXPLORE', {loc: 'Test'});

            expect(target.player.updateExplored.mock.calls.length).toEqual(1);
            expect(target.player.updateExplored.mock.calls[0][0]).toEqual('Test');
        });

        test('responds to PLAYER_SEARCH', () => {
            target.playerAction('PLAYER_SEARCH', {loc: 'Test'});

            expect(target.player.updateSearched.mock.calls.length).toEqual(1);
            expect(target.player.updateSearched.mock.calls[0][0]).toEqual('Test');
        });

        test('responds to PLAYER_PICKUP', () => {
            target.playerAction('PLAYER_PICKUP', {loc: 'Test', item: 'Skull'});

            expect(target.player.pickupItem.mock.calls.length).toEqual(1);
            expect(target.player.pickupItem.mock.calls[0][0]).toEqual('Skull');

            expect(target.mapManager.pickup.mock.calls.length).toEqual(1);
            expect(target.mapManager.pickup.mock.calls[0][0]).toEqual('Skull');
            expect(target.mapManager.pickup.mock.calls[0][1]).toEqual('Test');
        });

        test('responds to PLAYER_DROP', () => {
            target.playerAction('PLAYER_DROP', {loc: 'Test', item: 'Skull'});

            expect(target.player.dropItem.mock.calls.length).toEqual(1);
            expect(target.player.dropItem.mock.calls[0][0]).toEqual('Skull');

            expect(target.mapManager.place.mock.calls.length).toEqual(1);
            expect(target.mapManager.place.mock.calls[0][0]).toEqual('Skull');
            expect(target.mapManager.place.mock.calls[0][1]).toEqual('Test');
        });
    });
});