'use strict';

import {contains, without} from 'underscore';
import {observable, action} from 'mobx';

export default class Player {
    @observable inventory;
    @observable loc;
    @observable map;

    constructor(inv=[], map=[], loc='Foyer') {
        this.inventory = inv;
        this.loc = loc;
        this.map = map;

        this.updateMap(this.loc);

        console.log('Player() finished constructor.', this.map);
    }

    @action pickupItem(item) {
        this.inventory.push(item);
        console.log('pickupItem():', item, this.inventory);
    }

    @action dropItem(item) {
        console.log('dropItem(): dropping', item);
        if (this.hasItem(item)) {
            this.inventory = without(this.inventory, item);
        
        } else {
            console.error('dropItem(): could not drop', item);
        }
    }

    hasItem(item) {
        return contains(this.inventory, item);
    }

    visited(loc) {
        return contains(this.map, loc);
    }

    @action updateMap(loc) {
        console.log('updateMap():', loc);

        if (!this.visited(loc)) {
            this.map.push(loc);
        }

        console.log('updateMap(): done', this.map);
    }

    @action move(loc) {
        console.log('move():', loc);

        this.updateMap(loc);
        this.loc = loc;
    }
}
