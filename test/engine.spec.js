// TODO: Redo tests for dynamic item generation.
// NOTE: See MapManager.items for item locs.

import Engine from '../src/spoopy/engine';

import Player from '../src/spoopy/player';
import ItemDB from '../src/spoopy/items';
import RoomDB from '../src/spoopy/rooms';
import EventManager from '../src/spoopy/eventmanager';
import MapManager from '../src/spoopy/mapmanager';

jest.useFakeTimers();

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
        items: 2,
    };

    const FOYER_LOCATION = 'Foyer';
    const FOYER_DESCRIPTIONS = [
        "A musty smell fills your nostrils as you survey the dust-covered entranceway.",
        "The floorboards creak with an unearthly groan as you carefully step into the crumbling foyer.",
        "It isn\"t hard for you to imagine the former grandeur of the decaying foyer.",
    ];

    const UNEXPLORED_LOCATION = 'A dark and indistinct room';
    const UNEXPLORED_DESCRIPTION = 'You can\'t really make out too much standing here.';
    const HEALTH_DESCRIPTION = 'You feel perfectly healthy.';
    const INVENTORY_DESCRIPTION = 'Your pockets are quite empty.';
    const BATTERY_DESCRIPTION = 'Your phone\'s battery is full.';

    const INVENTORY_HOLDING_DESCRIPTION = /You are currently holding/;

    const ACTION_EXPLORE_TEXT = 'Take a look around.';
    const ACTION_SEARCH_TEXT = 'Search the room.';
    const ACTION_NOTHING = 'There\'s nothing more here to find.';
    const ACTION_CLASSES = expect.objectContaining(['button-small', 'cursor-pointer']);
    const ACTION_CLASSES_NOCLICK = expect.objectContaining(['button-small']);

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

        // NOTE: propClock is not yet implemented
        // TODO: once propClock is implemented, check it in tests

        test('initial state is correct', () => {
            const GUIState = target.GUIState;

            expect(GUIState).toHaveProperty('propDescription', UNEXPLORED_DESCRIPTION);
            expect(GUIState).toHaveProperty('propLocation', UNEXPLORED_LOCATION);

            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toEqual(1);

            expect(GUIState).toHaveProperty('propButtonGridExits');
            expect(GUIState.propButtonGridExits.length).toBeGreaterThanOrEqual(1);

            expect(GUIState).toHaveProperty('propHealth', HEALTH_DESCRIPTION);
            expect(GUIState).toHaveProperty('propInventory', INVENTORY_DESCRIPTION);
            expect(GUIState).toHaveProperty('propBattery', BATTERY_DESCRIPTION);
        });

        test('state is correct after PLAYER_MOVE at fresh location', () => {
            // explore; can't see exits until we explore
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // take the first exit
            target.GUIState.propButtonGridExits[0].onClickHandler();

            const GUIState = target.GUIState;

            expect(GUIState).toHaveProperty('propDescription', UNEXPLORED_DESCRIPTION);
            expect(GUIState).toHaveProperty('propLocation', UNEXPLORED_LOCATION);

            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toEqual(1);

            expect(GUIState.propButtonGridActions[0].display).toEqual(ACTION_EXPLORE_TEXT);
            expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES);

            expect(GUIState).toHaveProperty('propHealth', HEALTH_DESCRIPTION);
            expect(GUIState).toHaveProperty('propInventory', INVENTORY_DESCRIPTION);
            expect(GUIState).toHaveProperty('propBattery', BATTERY_DESCRIPTION);
        });

        test('state is correct after PLAYER_MOVE at explored location', () => {
            // explore; can't see exits until we explore
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // take the first exit
            target.GUIState.propButtonGridExits[0].onClickHandler();

            // explore at new location; can't see exits until we explore
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // move back to original location
            target.GUIState.propButtonGridExits[0].onClickHandler();

            const GUIState = target.GUIState;

            expect(FOYER_DESCRIPTIONS).toContain(GUIState.propDescription);
            expect(GUIState).toHaveProperty('propLocation', FOYER_LOCATION);

            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toEqual(1);

            expect(GUIState.propButtonGridActions[0].display).toEqual(ACTION_SEARCH_TEXT);
            expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES);

            expect(GUIState).toHaveProperty('propHealth', HEALTH_DESCRIPTION);
            expect(GUIState).toHaveProperty('propInventory', INVENTORY_DESCRIPTION);
            expect(GUIState).toHaveProperty('propBattery', BATTERY_DESCRIPTION);
        });

        test('state is correct after PLAYER_MOVE at searched location', () => {
            // explore; can't see exits until we explore
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // search
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // take the first exit
            target.GUIState.propButtonGridExits[0].onClickHandler();

            // explore at new location; can't see exits until we explore
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // move back to original location
            target.GUIState.propButtonGridExits[0].onClickHandler();

            const GUIState = target.GUIState;

            expect(FOYER_DESCRIPTIONS).toContain(GUIState.propDescription);
            expect(GUIState).toHaveProperty('propLocation', FOYER_LOCATION);

            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toEqual(1);

            expect(GUIState.propButtonGridActions[0].display).toEqual(ACTION_NOTHING);
            expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES_NOCLICK);

            expect(GUIState).toHaveProperty('propHealth', HEALTH_DESCRIPTION);
            expect(GUIState).toHaveProperty('propInventory', INVENTORY_DESCRIPTION);
            expect(GUIState).toHaveProperty('propBattery', BATTERY_DESCRIPTION);
        });

        test('state is correct after PLAYER_EXPLORE at fresh location', () => {
            // explore; can't see exits until we explore
            target.GUIState.propButtonGridActions[0].onClickHandler();

            const GUIState = target.GUIState;

            expect(FOYER_DESCRIPTIONS).toContain(GUIState.propDescription);
            expect(GUIState).toHaveProperty('propLocation', FOYER_LOCATION);

            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toEqual(1);

            expect(GUIState.propButtonGridActions[0].display).toEqual(ACTION_SEARCH_TEXT);
            expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES);

            expect(GUIState).toHaveProperty('propHealth', HEALTH_DESCRIPTION);
            expect(GUIState).toHaveProperty('propInventory', INVENTORY_DESCRIPTION);
            expect(GUIState).toHaveProperty('propBattery', BATTERY_DESCRIPTION);
        });

        test('state is correct after PLAYER_SEARCH at explored location', () => {
            // explore; can't see exits until we explore
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // search
            target.GUIState.propButtonGridActions[0].onClickHandler();

            const GUIState = target.GUIState;

            expect(FOYER_DESCRIPTIONS).toContain(GUIState.propDescription);
            expect(GUIState).toHaveProperty('propLocation', FOYER_LOCATION);

            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toEqual(1);

            // TODO: fix this test to be more general / rng-proof
            // NOTE: if we have items, it'll be something from the list...?
            if (!target.mapManager.find('Foyer').items.length) {
                expect(GUIState.propButtonGridActions[0].display).toEqual(ACTION_NOTHING);
                expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES_NOCLICK);
            } else {
                expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES);
            }

            expect(GUIState).toHaveProperty('propHealth', HEALTH_DESCRIPTION);
            expect(GUIState).toHaveProperty('propInventory', INVENTORY_DESCRIPTION);
            expect(GUIState).toHaveProperty('propBattery', BATTERY_DESCRIPTION);
        });

        test('state is correct with items in list, displays after search', () => {
            target.mapManager.place(
                target.itemDB.item('Skull'),
                'Foyer'
            );
            target.updateGUIState();
            
            // explore; can't see exits until we explore
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // search
            target.GUIState.propButtonGridActions[0].onClickHandler();

            let GUIState = target.GUIState;

            expect(FOYER_DESCRIPTIONS).toContain(GUIState.propDescription);
            expect(GUIState).toHaveProperty('propLocation', FOYER_LOCATION);

            // TODO: generation to be fixed for testing?
            // NOTE: propButtonGridActions.length might be 1 or 2 depending on random gen
            expect(GUIState).toHaveProperty('propButtonGridActions');
            expect(GUIState.propButtonGridActions.length).toBeLessThanOrEqual(2);

            // TODO: fix display check, item list will be in the available items...
            expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES);

            expect(GUIState).toHaveProperty('propHealth', HEALTH_DESCRIPTION);
            expect(GUIState).toHaveProperty('propInventory', INVENTORY_DESCRIPTION);
            expect(GUIState).toHaveProperty('propBattery', BATTERY_DESCRIPTION);

            // pick up the item
            target.GUIState.propButtonGridActions[0].onClickHandler();

            // recheck GUIState
            GUIState = target.GUIState;

            expect(FOYER_DESCRIPTIONS).toContain(GUIState.propDescription);
            expect(GUIState).toHaveProperty('propLocation', FOYER_LOCATION);

            expect(GUIState).toHaveProperty('propButtonGridActions');
            

            if (target.mapManager.find('Foyer').items.length) {
                expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES);

            } else {
                expect(GUIState.propButtonGridActions.length).toEqual(1);
                expect(GUIState.propButtonGridActions[0].display).toEqual(ACTION_NOTHING);
                expect(GUIState.propButtonGridActions[0].classes).toEqual(ACTION_CLASSES_NOCLICK);
            }            

            expect(GUIState).toHaveProperty('propHealth', HEALTH_DESCRIPTION);
            expect(GUIState.propInventory).toMatch(INVENTORY_HOLDING_DESCRIPTION);
            expect(GUIState).toHaveProperty('propBattery', BATTERY_DESCRIPTION);
        });

        test('corner case throws error', () => {
            // replace functions with forced bad return value mocks
            target.player.hasExplored = jest.fn().mockReturnValue(false);
            target.player.hasSearched = jest.fn().mockReturnValue(true);

            expect(
                () => target.updateGUIState()
            ).toThrowError(/Unexpected/);
        });
    });

    describe('playerAction()', () => {
        beforeEach(() => {
            target = new Engine(params);

            // replace playerAction function targets with Jest mocks
            target.player.move = jest.fn();
            target.player.explore = jest.fn();
            target.player.search = jest.fn();
            target.player.pickup = jest.fn();
            target.player.drop = jest.fn();
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

            expect(target.player.explore.mock.calls.length).toEqual(1);
            expect(target.player.explore.mock.calls[0][0]).toEqual('Test');
        });

        test('responds to PLAYER_SEARCH', () => {
            target.playerAction('PLAYER_SEARCH', {loc: 'Test'});

            expect(target.player.search.mock.calls.length).toEqual(1);
            expect(target.player.search.mock.calls[0][0]).toEqual('Test');
        });

        test('responds to PLAYER_PICKUP', () => {
            target.playerAction('PLAYER_PICKUP', {loc: 'Test', item: 'Skull'});

            expect(target.player.pickup.mock.calls.length).toEqual(1);
            expect(target.player.pickup.mock.calls[0][0]).toEqual('Skull');

            expect(target.mapManager.pickup.mock.calls.length).toEqual(1);
            expect(target.mapManager.pickup.mock.calls[0][0]).toEqual('Skull');
            expect(target.mapManager.pickup.mock.calls[0][1]).toEqual('Test');
        });

        test('responds to PLAYER_DROP', () => {
            target.playerAction('PLAYER_DROP', {loc: 'Test', item: 'Skull'});

            expect(target.player.drop.mock.calls.length).toEqual(1);
            expect(target.player.drop.mock.calls[0][0]).toEqual('Skull');

            expect(target.mapManager.place.mock.calls.length).toEqual(1);
            expect(target.mapManager.place.mock.calls[0][0]).toEqual('Skull');
            expect(target.mapManager.place.mock.calls[0][1]).toEqual('Test');
        });
    });

    describe('events', () => {
        beforeEach(() => {
            target = new Engine(params);
        });

        test('game ends at 60 minutes', () => {
            // replace endGame() with mock function to test trigger
            target.endGame = jest.fn();

            // skip time to 60m
            jest.runTimersToTime(60 * 60 * 1000);

            expect(target.endGame).toHaveBeenCalled();
        });
    });
});