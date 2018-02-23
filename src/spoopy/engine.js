import { filter, contains, sample, chain, range, isFunction, random, without } from 'underscore';
import { computed, action, observable } from 'mobx';

import Player from './player';
import ItemDB from './items';
import RoomDB from './rooms';
import EventManager from './eventmanager';

export default class Engine {

    constructor(build_params) {
        this.player = new Player();
        this.itemDB = new ItemDB();
        this.roomDB = new RoomDB();

        this.adjacency = {};
        this.exclusions = [];
        this.available = this.roomDB.room_names;
        this.itemMap = {};

        // slightly ugly non-decorator due to mobx only tracking object props that are
        // there when the object is declared - need to use extendObservable() for dynamic 
        // or look into observable.map()
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

        this.buildMap(build_params);
        
        this.eventManager = new EventManager();
        this.eventManager.add([{
            name: 'Global',
            timer: 60 * 60,
            trigger: () => this.endGame(),
            repeats: false,
            startPaused: false,
        }]);

        // refresh gui state for game start
        this.updateGUIState();
    }

    endGame() {
        console.log('YOU LOST! :(');
    }

    updateGUIState() {
        // generate props for button grids (exits and actions)
        let propButtonGridActions, propButtonGridExits;
        let here = this.player.currentLocation;

        // completely new room (not explored, not searched)
        if (!this.player.hasExplored(here) && !this.player.hasSearched(here)) {
            propButtonGridExits = [{}];

            propButtonGridActions = [{
                display: 'Take a look around.',
                classes: ['button-small', 'cursor-pointer'],
                onClickHandler: () => this.playerExplore(here),
            }];

        // explored room, but NOT searched (should see exits, but no items)
        } else if (this.player.hasExplored(here) && !this.player.hasSearched(here)) {
            propButtonGridExits = this.adjacency[here].map(
                exit => ({
                    display: this.player.hasVisited(exit) ? exit : this.randomUnexplored,
                    classes: this.player.hasVisited(exit) ? ['button-large', 'cursor-pointer'] : ['button-large', 'cursor-pointer', 'text-italics'],
                    onClickHandler: () => this.playerMove(exit)
                })
            );

            propButtonGridActions = [{
                display: 'Search the room.',
                classes: ['button-small', 'cursor-pointer'],
                onClickHandler: () => this.playerSearch(here),
            }];

        // explored room and searched room - should display items and exits
        // a bit of repeat code for propButtonGridExits - maybe refactor?
        } else if (this.player.hasExplored(here) && this.player.hasSearched(here)) {
            propButtonGridExits = this.adjacency[here].map(
                exit => ({
                    display: this.player.hasVisited(exit) ? exit : this.randomUnexplored,
                    classes: ['button-large', 'cursor-pointer'],
                    onClickHandler: () => this.playerMove(exit)
                })
            );

            propButtonGridActions = this.roomHasItems(here) ?
                this.roomItems(here).map(
                    item => ({
                        display: item.name,
                        classes: ['button-small', 'cursor-pointer'],
                        onClickHandler: () => this.playerPickup(item)
                    })

                // no items, show nothing here to find
                ) : [{
                    display: 'There\'s nothing more here to find.',
                    classes: ['button-small']
                }];

        } else {
            console.error('Unexpected exploration/search case!');
        }

        this.GUIState.propLocation = this.player.hasExplored(this.player.currentLocation) ?
            this.player.currentLocation : 'A dark and indistinct room';

        this.GUIState.propDescription = this.player.hasExplored(this.player.currentLocation) ?
            this.roomDB.getDescription(this.player.currentLocation) : 'You can\'t really make out too much standing here.';

        this.GUIState.propButtonGridActions = propButtonGridActions;
        this.GUIState.propButtonGridExits = propButtonGridExits;
        this.GUIState.propHealth = this.playerHealthDescription;
        this.GUIState.propInventory = this.playerInventoryDescription;
        this.GUIState.propBattery = this.playerBatteryDescription;
        this.GUIState.animate = true;
    }

    @action playerMove(loc) {
        this.player.move(loc);
        this.updateGUIState();
    }

    @action playerSearch(loc) {
        this.player.updateSearched(loc);
        this.updateGUIState();
    }

    @action playerExplore(loc) {
        this.player.updateExplored(loc);
        this.updateGUIState();
    }

    @action playerPickup(item) {
        this.player.pickupItem(item);
        this.roomRemoveItem(item, this.player.currentLocation);
        this.updateGUIState();
    }

    @action playerDrop(item) {
        this.player.dropItem(item);
        this.roomPlaceItem(item, this.player.currentLocation);
        this.updateGUIState();
    }

    get playerBatteryDescription() {
        return this.player.currentBatteryDescription;
    }

    get playerHealthDescription() {
        return this.player.currentHealthDescription;
    }

    get playerInventoryDescription() {
        return this.player.currentInventoryDescription;
    }

    get randomUnexplored() {
        return this.roomDB.random_unexplored;
    }

    roomHasItems(loc) {
        return this.itemMap[loc] === undefined ? false : this.itemMap[loc].length > 0;
    }

    roomItems(loc) {
        return this.roomHasItems(loc) ? this.itemMap[loc] : [];
    }

    @action roomPlaceItem(item, loc) {
        // sanity checks
        if (!contains(this.exclusions, loc)) {
            console.error('roomPlaceItem():', loc, 'does not exist.');
            return;
        }

        if (this.itemMap[loc] === undefined) {
            this.itemMap[loc] = [];
        }

        this.itemMap[loc].push(item);
        this.updateGUIState();
    }

    @action roomRemoveItem(item, loc) {
        // sanity checks
        if (!contains(this.exclusions, loc)) {
            console.error('roomRemoveItem():', loc, 'does not exist.');
            return;
        }

        if (!contains(this.itemMap[loc], item)) {
            console.error('roomRemoveITem():', item, 'not found.');
            return;
        }

        this.itemMap[loc] = without(this.itemMap[loc], item);
        this.updateGUIState();
    }

    getRoom(params = undefined) {
        let filtered = params === undefined ?
            filter(
                this.available,

                // NOTE: this context below is the context provided, not the Engine object
                function (i) { return !contains(this.exc, i); },
                { exc: this.exclusions }

            ) : filter(
                params.use_list,
                params.filter_function,
                params.context
            );

        if (filtered.length > 0) {
            return sample(filtered);
        } else {
            console.error('getRoom(): no valid rooms available');
            return undefined;
        }
    }

    updateExclusions(update) {
        this.exclusions = chain(this.exclusions)
            .union(update)
            .unique()
            .value();
    }

    updateAdjacency(from, to) {
        if (from === undefined || to === undefined) {
            console.error('updateAdjacency(): cannot update adjacency to undefined');
            return;
        }

        if (this.adjacency[from] === undefined) { this.adjacency[from] = []; }
        if (this.adjacency[to] === undefined) { this.adjacency[to] = []; }

        if (!contains(this.adjacency[from], to)) { this.adjacency[from].push(to); }
        if (!contains(this.adjacency[to], from)) { this.adjacency[to].push(from); }
    }

    buildMapAt(loc, branches) {
        this.updateExclusions([loc]);
        for (let i in range(
            isFunction(branches) ? branches() : branches
        )) {

            let pick = this.getRoom();

            if (pick === undefined) {
                break;
            } else {
                this.updateAdjacency(loc, pick);
                this.updateExclusions([pick]);
            }
        }
    }

    connectLeaves(leaves) {
        let leaf_params = {
            use_list: this.exclusions,
            filter_function: function (i) {
                return this.adj[i].length === 1 && !contains(this.exc, i);
            },
            context: { adj: this.adjacency, exc: [] }
        };

        // TODO: connect n-random number of leaves, rather than just pairs?
        for (let i in range(leaves)) {
            let leaf_1 = this.getRoom(leaf_params);
            leaf_params.context.exc.push(leaf_1);
            let leaf_2 = this.getRoom(leaf_params);

            this.updateAdjacency(leaf_1, leaf_2);
        }
    }

    // TODO: make recursive for n-generations
    // NOTE: for now, we just do one generation of branches
    buildMap(params) {
        this.buildMapAt(
            params.start.loc,
            random(
                params.start.min_branches,
                params.start.max_branches
            )
        );

        let branches = this.adjacency[params.start.loc];
        for (let i in range(params.branches.gens)) {
            for (let j in branches) {
                this.buildMapAt(
                    branches[j],
                    random(
                        params.branches.min_branches,
                        params.branches.max_branches
                    )
                );
            }
        }

        this.connectLeaves(params.leaf_connections);
        console.log('buildMap(): completed!', this.adjacency, this.exclusions);

        /* experimental item placement */
        let random_room = this.getRoom({
            use_list: this.exclusions,
            filter_function: function (i) { return !contains(i, this.exc); },
            context: { exc: 'Foyer' }
        });

        let random_item = this.itemDB.random_item([]);
        // this.roomPlaceItem(random_item, random_room);
        this.roomPlaceItem(random_item, 'Foyer');
        console.log('placement done:', this.itemMap);
        /* end experimental item placement */
    }
}
