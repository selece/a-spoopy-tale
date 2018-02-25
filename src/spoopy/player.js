'use strict';

import {contains, without} from 'underscore';

export default class Player {
    constructor() {
        this.loc = 'Foyer';
        this.inventory = [];
        this.map = [];
        this.explored = [];
        this.searched = [];
        this.health = 100;
        this.battery = 100;

        this.updateMap(this.loc);
    }

    get currentInventoryDescription() {
        // if the inventory is empty, return generic 'empty' response
        // TODO: have list of random phrases to randomly select from
        if (this.inventory.length === 0) {
            return 'Your pockets are quite empty.';
        
        // otherwise, build the response based on what we have right now
        } else {
            return `You are currently holding: ${this.inventory.map(

                // build the list for oxford comma correctness
                (item, i, inv) => {

                    // if the item.name starts with a vowel, prefix 'an', otherwise use 'a'
                    let indefinite_article = contains(['a', 'e', 'i', 'o', 'u'], item.name[0].toLowerCase()) ? 'an' : 'a';

                    // end of list, two cases to handle
                    if (inv.length - 1 === i) {

                        // list is exactly one item long, just return the item.name
                        // e.g. Skull
                        if (inv.length === 1) {
                            return `${indefinite_article} ${item.name}`

                        // list contains more than one item, return 'and item.name'
                        // e.g. and Skull
                        } else {
                            return `and ${indefinite_article} ${item.name}`;
                        }
                        
                    // not end of list, so we need to return a comma + name + space
                    // e.g. Skull, 
                    } else {
                        return `${indefinite_article} ${item.name}, `
                    }
                })
            }.`
        }
    }

    get currentBatteryDescription() {
        if (this.battery === 100) {
            return 'Your phone\'s battery is full.';
        } else {
            return 'Boop!';
        }
    }

    get currentBattery() {
        return this.battery;
    }

    get currentHealthDescription() {
        if (this.health === 100) {
            return 'You feel perfectly healthy.';
        } else {
            return 'Welp.';
        }
    }

    get currentHealth() {
        return this.health;
    }

    get currentSearched() {
        return this.searched;
    }

    get currentMap() {
        return this.map;
    }

    get currentExplored() {
        return this.explored;
    }

    get currentInventory() {
        return this.inventory;
    }

    get currentLocation() {
        return this.loc;
    }

    modifyHealth(amount) {
        this.health += amount;
        return this.health;
    }

    modifyBattery(amount) {
        this.battery += amount;
        return this.battery;
    }

    pickupItem(item) {
        this.inventory.push(item);
    }

    dropItem(item) {
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

    updateMap(loc) {
        if (!this.hasVisited(loc)) {
            this.map.push(loc);
        }
    }

    updateExplored(loc) {
        if (!this.hasExplored(loc)) {
            this.explored.push(loc);
        }
    }

    updateSearched(loc) {
        if (!this.hasSearched(loc)) {
            this.searched.push(loc);
        }
    }

    move(loc) {
        this.updateMap(loc);
        this.loc = loc;
    }
}
