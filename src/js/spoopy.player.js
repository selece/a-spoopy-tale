'use strict';

define(['pubsub'], (PS) => {

    // constructor
    function Player() {
        if (!(this instanceof Player)) {
            throw new TypeError('Player constructor cannot be called as a function!');
        }

        this.inventory = [];
        this.map = [];
        this.loc = Player.DEFAULT_STARTING_LOCATION;

        // NOTE: we have to bind the context (this) for the handler otherwise 'this'
        // turns into the Window/global-land and we lose the Player object context.
        this.move_handler = PS.subscribe('ENGINE_NAV_CLICK', this.move.bind(this));
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

        // NOTE: move() cannot be an arrow func. due to needing access to
        // the Player context via 'this' for the bind() call in the constructor.
        move: function(chan, new_loc) {
            console.log('player.move():', chan, new_loc);
            this.loc = new_loc;

            if (!_.contains(this.map, new_loc)) { 
                this.map.push(new_loc);
            }
        },
    };

    return Player;
});