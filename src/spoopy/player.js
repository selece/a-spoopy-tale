'use strict';

import {contains, without} from 'underscore';
import {observable, action, computed} from 'mobx';

export default class Player {
    @observable inventory;
    @observable loc;
    @observable map;
    @observable explored;
    @observable searched;

    constructor() {
        this.loc = 'Foyer';
        this.inventory = [];
        this.map = [];
        this.explored = [];
        this.searched = [];

        this.updateMap(this.loc);
    }

    @computed get currentSearched() {
        return this.searched;
    }

    @computed get currentMap() {
        return this.map;
    }

    @computed get currentExplored() {
        return this.explored;
    }

    @computed get currentInventory() {
        return this.inventory;
    }

    @computed get currentLocation() {
        return this.loc;
    }

    @action pickupItem(item) {
        this.inventory.push(item);
    }

    @action dropItem(item) {
        if (this.hasItem(item)) {
            this.inventory = without(this.inventory, item);
        
        } else {
            console.error('dropItem(): could not drop', item);
        }
    }

    hasItem(item) {
        return contains(this.inventory, item);
    }

    hasVisited(loc) {
        return contains(this.map, loc);
    }

    hasExplored(loc) {
        return contains(this.explored, loc);
    }

    hasSearched(loc) {
        return contains(this.searched, loc);
    }

    @action updateMap(loc) {
        if (!this.hasVisited(loc)) {
            this.map.push(loc);
        }
    }

    @action updateExplored(loc) {
        if (!this.hasExplored(loc)) {
            this.explored.push(loc);
        }
    }

    @action updateSearched(loc) {
        if (!this.hasSearched(loc)) {
            this.searched.push(loc);
        }
    }

    @action move(loc) {
        this.updateMap(loc);
        this.loc = loc;
    }
}
