import { filter, contains, sample, chain, range, isFunction, random, without, keys } from 'underscore';
import { computed, action, observable } from 'mobx';

import Player from './player';
import ItemDB from './items';
import RoomDB from './rooms';
import EventManager from './eventmanager';
import MapManager from './mapmanager';

export default class Engine {

    constructor(build_params) {
        this.player = new Player();
        this.itemDB = new ItemDB();
        this.roomDB = new RoomDB();

        this.eventManager = new EventManager();
        this.mapManager = new MapManager(this.roomDB.room_names);

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
            animate: undefined,
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

        this.mapManager.generate(build_params);

        // map player actions for playerAction()
        this._playerActions = {
            'PLAYER_MOVE': arg => this.player.move(arg),
            'PLAYER_EXPLORE': arg => this.player.updateExplored(arg),
            'PLAYER_SEARCH': arg => this.player.updateSearched(arg),

            'PLAYER_PICKUP': arg => {
                this.player.pickupItem(arg);
                this.mapManager.pickup(arg, this.player.status.loc.value);
            },

            'PLAYER_DROP': arg => {
                this.player.dropItem(arg);
                this.mapManager.place(arg, this.player.status.loc.value);
            },
        };

        // refresh gui state for game start
        this.updateGUIState();
    }

    endGame() {
        console.log('YOU LOST! :(');
    }

    updateGUIState() {
        // generate props for button grids (exits and actions)
        let propButtonGridActions, propButtonGridExits;
        let status = this.player.status;
        let here = status.loc.value;
        let room = this.mapManager.find(here);

        // completely new room (not explored, not searched)
        if (!this.player.hasExplored(here) && !this.player.hasSearched(here)) {
            propButtonGridExits = [{}];

            propButtonGridActions = [{
                display: 'Take a look around.',
                classes: ['button-small', 'cursor-pointer'],
                onClickHandler: () => this.playerAction('PLAYER_EXPLORE', here),
            }];

        // explored room, but NOT searched (should see exits, but no items)
        } else if (this.player.hasExplored(here) && !this.player.hasSearched(here)) {
            propButtonGridExits = room.adjacency.map(
                exit => ({
                    display: this.player.hasVisited(exit) ? exit : this.roomDB.random_unexplored,
                    classes: this.player.hasVisited(exit) ? ['button-large', 'cursor-pointer'] : ['button-large', 'cursor-pointer', 'text-italics'],
                    onClickHandler: () => this.playerAction('PLAYER_MOVE', exit),
                })
            );

            propButtonGridActions = [{
                display: 'Search the room.',
                classes: ['button-small', 'cursor-pointer'],
                onClickHandler: () => this.playerAction('PLAYER_SEARCH', here),
            }];

        // explored room and searched room - should display items and exits
        // a bit of repeat code for propButtonGridExits - maybe refactor?
        } else if (this.player.hasExplored(here) && this.player.hasSearched(here)) {
            propButtonGridExits = room.adjacency.map(
                exit => ({
                    display: this.player.hasVisited(exit) ? exit : this.roomDB.random_unexplored,
                    classes: ['button-large', 'cursor-pointer'],
                    onClickHandler: () => this.playerAction('PLAYER_MOVE', exit),
                })
            );

            propButtonGridActions = room.items.length > 0 ?
                room.items.map(
                    item => ({
                        display: item.name,
                        classes: ['button-small', 'cursor-pointer'],
                        onClickHandler: () => this.playerAction('PLAYER_PICKUP', item),
                    })

                // no items, show nothing here to find
                ) : [{
                    display: 'There\'s nothing more here to find.',
                    classes: ['button-small']
                }];

        } else {
            console.error(`Unexpected exploration/search case! - Error occured at ${here} with values ${room}.`);
        }

        this.GUIState.propLocation = this.player.hasExplored(this.player.currentLocation) ?
            this.player.status.loc.value : 'A dark and indistinct room';

        this.GUIState.propDescription = this.player.hasExplored(this.player.currentLocation) ?
            this.roomDB.getDescription(this.player.currentLocation) : 'You can\'t really make out too much standing here.';

        this.GUIState.propButtonGridActions = propButtonGridActions;
        this.GUIState.propButtonGridExits = propButtonGridExits;
        this.GUIState.propHealth = this.player.status.health.descriptive;
        this.GUIState.propInventory = this.player.status.inventory.descriptive;
        this.GUIState.propBattery = this.player.status.battery.descriptive;
        this.GUIState.animate = true;
    }

    @action playerAction(action, arg) {
        if (!contains(keys(this._playerActions), action)) {
            throw new Error(`"${action}" is not a valid action.`);
        }
        
        this._playerActions[action](arg);
        this.updateGUIState();
    }
}
