'use strict';

import { filter, contains, sample, chain, range, isFunction, random, without, keys } from 'underscore';
import { computed, action, observable } from 'mobx';

import Player from './player';
import ItemDB from './items';
import RoomDB from './rooms';
import EventManager from './eventmanager';
import MapManager from './mapmanager';

export default class Engine {

    constructor(params) {
        this.player = new Player();
        this.itemDB = new ItemDB();
        this.roomDB = new RoomDB();

        this.eventManager = new EventManager();
        this.mapManager = new MapManager(this.roomDB.room_names, this.itemDB);

        // slightly ugly non-decorator due to mobx only tracking object props that exist
        // when the object is declared
        // see: extendObservable() or observable.map() for dynamic properties
        this.GUIState = observable({
            propDescription: undefined,
            propLocation: undefined,
            propButtonGridActions: undefined,
            propButtonGridExits: undefined,
            propHealth: undefined,
            propInventory: undefined,
            propBattery: undefined,
            propClock: undefined,
        });
        
        // set up our managers with game startup events, seeds etc.
        this.eventManager.add(
            [
                // end of game event, occurs 60 minutes after start
                {
                    name: 'Global',
                    timer: 60 * 60,
                    trigger: () => this.endGame(),
                    repeats: false,
                    startPaused: false,
                },
            ]
        );

        this.mapManager.generate(params);

        // map player actions for playerAction()
        this._playerActions = {
            'PLAYER_MOVE': arg => {
                this.player.move(arg.loc);
            },

            'PLAYER_EXPLORE': arg => {
                this.player.explore(arg.loc);
            },

            'PLAYER_SEARCH': arg => {
                this.player.search(arg.loc);
            },

            'PLAYER_PICKUP': arg => {
                this.player.pickup(arg.item);
                this.mapManager.pickup(arg.item, arg.loc);
            },

            'PLAYER_DROP': arg => {
                this.player.drop(arg.item);
                this.mapManager.place(arg.item, arg.loc);
            },
        };

        // refresh gui state for game start
        this.updateGUIState();
    }

    endGame() {
        // TODO: implement endgame sequence, update GUI etc.
    }

    updateGUIState() {
        // generate props for button grids (exits and actions)
        const status = this.player.status;
        const here = status.loc.value;
        const room = this.mapManager.find(here);
        
        let propButtonGridActions, propButtonGridExits;
        
        // completely new room (not explored, not searched)
        if (!this.player.query({hasExplored: here}) && !this.player.query({hasSearched: here})) {
            propButtonGridExits = [{}];

            propButtonGridActions = [{
                display: 'Take a look around.',
                classes: ['button-small', 'cursor-pointer'],
                onClickHandler: () => this.playerAction('PLAYER_EXPLORE', {loc: here}),
            }];

        // explored room, but NOT searched (should see exits, but no items)
        } else if (this.player.query({hasExplored: here}) && !this.player.query({hasSearched: here})) {
            propButtonGridExits = room.adjacency.map(
                exit => ({
                    display: this.player.query({hasVisited: exit}) ? exit : this.roomDB.random_unexplored,
                    classes: this.player.query({hasVisited: exit}) ? ['button-large', 'cursor-pointer'] : ['button-large', 'cursor-pointer', 'text-italics'],
                    onClickHandler: () => this.playerAction('PLAYER_MOVE', {loc: exit}),
                })
            );

            propButtonGridActions = [{
                display: 'Search the room.',
                classes: ['button-small', 'cursor-pointer'],
                onClickHandler: () => this.playerAction('PLAYER_SEARCH', {loc: here}),
            }];

        // explored room and searched room - should display items and exits
        // a bit of repeat code for propButtonGridExits - maybe refactor?
        } else if (this.player.query({hasExplored: here}) && this.player.query({hasSearched: here})) {
            propButtonGridExits = room.adjacency.map(
                exit => ({
                    display: this.player.hasVisited(exit) ? exit : this.roomDB.random_unexplored,
                    classes: ['button-large', 'cursor-pointer'],
                    onClickHandler: () => this.playerAction('PLAYER_MOVE', {loc: exit}),
                })
            );

            propButtonGridActions = room.items.length ?
                room.items.map(
                    item => ({
                        display: item.name,
                        classes: ['button-small', 'cursor-pointer'],
                        onClickHandler: () => this.playerAction('PLAYER_PICKUP', {item: item, loc: here}),
                    })

                // no items, show nothing here to find
                ) : [{
                    display: 'There\'s nothing more here to find.',
                    classes: ['button-small']
                }];

        } else {
            throw new Error(`Unexpected exploration/search case! @ ${here} w/ ${room}.`);
        }

        this.GUIState.propLocation = this.player.query({hasExplored: status.loc.value}) ?
            this.player.status.loc.value : 'A dark and indistinct room';

        this.GUIState.propDescription = this.player.query({hasExplored: status.loc.value}) ?
            this.roomDB.getDescription(status.loc.value) : 'You can\'t really make out too much standing here.';

        this.GUIState.propButtonGridActions = propButtonGridActions;
        this.GUIState.propButtonGridExits = propButtonGridExits;
        this.GUIState.propHealth = this.player.status.health.descriptive;
        this.GUIState.propInventory = this.player.status.inventory.descriptive;
        this.GUIState.propBattery = this.player.status.battery.descriptive;
    }

    @action playerAction(action, arg) {
        if (!contains(keys(this._playerActions), action)) {
            throw new Error(`"${action}" is not a valid action.`);
        }

        if (typeof arg !== 'object' || arg === undefined || arg === null) {
            throw new Error(`${arg} is not a valid parameter.`);
        }

        this._playerActions[action](arg);
        this.updateGUIState();
    }
}
