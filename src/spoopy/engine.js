import {filter, contains, sample, chain, range, isFunction, random, without} from 'underscore';
import {computed, action, observable} from 'mobx';

import Player from './player';
import ItemDB from './items';
import RoomDB from './rooms';

export default class Engine {

    constructor() {
        this.player = new Player();
        this.itemDB = new ItemDB();
        this.roomDB = new RoomDB();

        this.adjacency = {};
        this.exclusions = [];
        this.available = this.roomDB.room_names;
        this.itemMap = {};
    }
    
    @computed get gameState() {
        // generate props for button grids (exits and actions)
        let propButtonGridActions, propButtonGridExits;
        let loc = this.player.currentLocation;

        // completely new room (not explored, not searched)
        if (!this.player.hasExplored(loc) && !this.player.hasSearched(loc)) {
            propButtonGridExits = [{
                display: 'You can\'t really make out too much standing here.',
                classes: ['button-inactive'],
            }];

            propButtonGridActions = [{
                display: 'Take a look around.',
                classes: ['button-small', 'cursor-pointer'],
                onClickHandler: () => this.playerExplore(loc),
            }];
        
        // explored room, but NOT searched (should see exits, but no items)
        } else if (this.player.hasExplored(loc) && !this.player.hasSearched(loc)) {
            propButtonGridExits = this.adjacency[loc].map(
                exit => ({
                    display: this.player.hasVisited(exit) ? exit : this.randomUnexplored,
                    classes: ['button-large', 'cursor-pointer'],
                    onClickHandler: () => this.playerMove(exit)
                })
            );

            propButtonGridActions = [{
                display: 'Search the room.',
                classes: ['button-small', 'cursor-pointer'],
                onClickHandler: () => this.playerSearch(loc),
            }];
        
        // explored room and searched room - should display items and exits
        // a bit of repeat code for propButtonGridExits - maybe refactor?
        } else if (this.player.hasExplored(loc) && this.player.hasSearched(loc)) {
            propButtonGridExits = this.adjacency[loc].map(
                exit => ({
                    display: this.player.hasVisited(exit) ? exit : this.randomUnexplored,
                    classes: ['button-large', 'cursor-pointer'],
                    onClickHandler: () => this.playerMove(exit)
                })
            );

            propButtonGridActions = this.roomHasItems(loc) ? 
                this.roomItems(loc).map(
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

        return {
            guiRender: {
                propDisplayLocation: this.player.hasExplored(this.player.currentLocation) ?
                    this.player.currentLocation : 'A dark and indistinct room',
                propDisplayDescription: this.player.hasExplored(this.player.currentLocation) ?
                    this.roomDB.getDescription(this.player.currentLocation) : '',
                propButtonGridActions: propButtonGridActions,
                propButtonGridExits: propButtonGridExits,
            },

            player: {
                loc: this.player.currentLocation,
                inventory: this.player.currentInventory,
                map: this.player.currentMap,
                explored: this.player.currentExplored,
            }
        };
    }

    @action playerMove(loc) {
        this.player.move(loc);
    }

    @action playerSearch(loc) {
        this.player.updateSearched(loc);
    }
    
    @action playerExplore(loc) {
        this.player.updateExplored(loc);
    }

    @action playerPickup(item) {
        this.player.pickupItem(item);
        this.roomRemoveItem(item, this.player.currentLocation);
    }

    @action playerDrop(item) {
        this.player.dropItem(item);
        this.roomPlaceItem(item, this.player.currentLocation);
    }
        
    get randomUnexplored() {
        return this.roomDB.random_unexplored;
    }
    
    roomHasItems(loc) {
        console.log('checking:', this.itemMap[loc].length);
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
        console.log(this.itemMap);
    }

    getRoom(params=undefined) {
        let filtered = params === undefined ?
            filter(
                this.available,
                
                // NOTE: this context below is the context provided, not the Engine object
                function(i) { return !contains(this.exc, i); },
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
            filter_function: function(i) {
                return this.adj[i].length === 1 && !contains(this.exc, i);
            },
            context: {adj: this.adjacency, exc: []}
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
            filter_function: function(i) { return !contains(i, this.exc); },
            context: {exc: 'Foyer'}
        });

        let random_item = this.itemDB.random_item([]);
        // this.roomPlaceItem(random_item, random_room);
        this.roomPlaceItem(random_item, 'Foyer');
        console.log('placement done:', this.itemMap);
        /* end experimental item placement */
    }
}
