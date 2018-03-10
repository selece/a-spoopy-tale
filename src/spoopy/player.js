'use strict';

import {pluck, contains, without, keys} from 'underscore';

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

        // condition resolver bindings
        this._conditionMap = {
            hasItem: arg => {
                return contains(pluck(this.inventory, 'name'), arg);
            },

            atLocation: arg => {
                return this.loc === arg;
            },

            hasSearched: arg => {
                return this.hasSearched(arg);
            },

            hasExplored: arg => {
                return this.hasExplored(arg);
            },

            hasVisited: arg => {
                return this.hasVisited(arg);
            },

            hasHealth: arg => {
                return this.health === arg;
            },

            hasHealthGreaterThan: arg => {
                return this.health >= arg;
            },

            hasHealthLessThan: arg => {
                return this.health <= arg;
            },

            hasBattery: arg => {
                return this.battery === arg;
            },

            hasBatteryGreaterThan: arg => {
                return this.battery >= arg;
            },

            hasBatteryLessThan: arg => {
                return this.battery <= arg;
            },
        }
    }

    get status() {
        return {
            inventory: {
                descriptive: this.currentInventoryDescription,
                value: this.inventory,
            },

            map: {
                value: this.map,
            },

            explored: {
                value: this.explored,
            },

            searched: {
                value: this.searched,
            },

            health: {
                descriptive: this.currentHealthDescription,
                value: this.health,
            },

            battery: {
                descriptive: this.currentBatteryDescription,
                value: this.battery,
            },

            loc: {
                value: this.loc,
            },

            conditions: this.currentConditions,
        };
    }

    get currentConditions() {
        let conditions = [];

        // current location condition
        conditions.push({atLoc: this.loc});

        // current items in inventory
        this.inventory.forEach(item => {
            conditions.push({hasItem: item.name});
        });

        return conditions;
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
                (item, index, list) => {
                    
                    // if the item starts with a vowel, prefix 'an', otherwise use 'a'
                    let indefinite_article = contains(
                        ['a', 'e', 'i', 'o', 'u'],
                        String(item.name).substring(0, 1).toLowerCase()
                    ) ? 'an' : 'a';

                    // if the list is exactly one item
                    if (list.length === 1) {
                        return `${indefinite_article} ${item.name}`;

                    // otherwise we need to build a comma-separated list
                    } else {

                        // if we're at the end of the list
                        // return 'and item name', e.g. 'and Skull'
                        if (index === list.length - 1) {
                            return `and ${indefinite_article} ${item.name}`;
                        
                        } else {
                            // if the list is only two items, don't add the oxford comma
                            if (list.length == 2) {
                                return `${indefinite_article} ${item.name} `;

                            // otherwise, add the oxford comma
                            } else {
                                return `${indefinite_article} ${item.name}, `;
                            }
                        }
                    }
                
                // NOTE: map returns an array - use join compact it into a single string
                // NOTE: no spaces in between the list items, already added above
                }).join('')
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

    get currentHealthDescription() {
        if (this.health === 100) {
            return 'You feel perfectly healthy.';
        } else {
            return 'Welp.';
        }
    }

    modifyHealth(amount) {
        if (isNaN(amount)) {
            throw new Error(`Expected integer, got ${amount}.`);
        }

        this.health += amount;
        return this.health;
    }

    modifyBattery(amount) {
        if (isNaN(amount)) {
            throw new Error(`Expected integer, got ${amount}.`);
        }

        this.battery += amount;
        return this.battery;
    }

    pickup(item) {
        this.inventory.push(item);
    }

    drop(item) {
        if (this.hasItem(item)) {
            this.inventory = without(this.inventory, item);
        
        } else {
            throw new Error(`Player does not have ${item} to drop.`);
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

    explore(loc) {
        if (!this.hasExplored(loc)) {
            this.explored.push(loc);
        }
    }

    search(loc) {
        if (!this.hasSearched(loc)) {
            this.searched.push(loc);
        }
    }

    move(loc) {
        this.updateMap(loc);
        this.loc = loc;
    }

    query(arg) {
        let res = [];

        Object.entries(arg).forEach(set => {
            let [key, val] = set;
            
            if (!contains(keys(this._conditionMap), key)) {
                throw new Error(`Invalid condition: ${key}.`);
            }

            res.push(this._conditionMap[key](val));
        });

        return res.every(elem => elem === true);
    }
}
