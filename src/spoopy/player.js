'use strict';

import {contains, without} from 'underscore';
import {observable, action, computed} from 'mobx';

export default class Player {
    @observable inventory;
    @observable loc;
    @observable map;
    @observable explored;

    constructor(inv=[], map=[], loc='Foyer', explored=[]) {
        this.inventory = inv;
        this.loc = loc;
        this.map = map;
        this.explored = explored;

        this.updateMap(this.loc);
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
        return this.explored[loc];
    }

    @action updateMap(loc) {
        if (!this.hasVisited(loc)) {
            this.map.push(loc);
        }
    }

    @action updateExplored(loc, searched) {
        this.explored[loc] = searched;
    }

    @action move(loc) {
        this.updateMap(loc);
        this.loc = loc;
    }
}
