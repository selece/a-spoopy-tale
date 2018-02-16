'use strict';

define([], () => {

    // constructor
    function Player() {
        if (!(this instanceof Player)) {
            throw new TypeError('Player constructor cannot be called as a function!');
        }

        this.inventory = [];
        this.map = [];
        this.loc = Player.DEFAULT_STARTING_LOCATION;

        console.log('Player() finished init.', this.map);
    }

    Player.DEFAULT_STARTING_LOCATION = 'Foyer';

    Player.prototype = {
        constructor: Player,

        pickup_item: item => {
            console.log('picking up', item);
            this.inventory.push(item);
        },

        drop_item: item => {
            console.log('dropping', item);

            if (_.contains(this.inventory, item)) {
                this.inventory = _.without(this.inventory, item);
            } else {
                console.error('drop_item() could not drop', item);
            }
        },

        visited: loc => {
            return _.contains(this.map, loc);
        },

        update_map: loc => {
            console.log('update_map():', loc);

            if (!this.visited(loc)) {
                this.map.push(loc);
            }

            console.log('update_map(): done', this.map);
        },

        // NOTE: move() cannot be an arrow func. due to needing access to
        // the Player context via 'this' for the bind() call in the constructor.
        move: loc => {
            console.log('player.move():', loc);
            this.loc = loc;
        },
    };

    return Player;
});