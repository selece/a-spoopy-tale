'use strict';

// define global config block for require
require.config({
    paths: {
        'jquery': '../jquery.min',
        'underscore': '../underscore.min',
        'pubsub': '../pubsub',
    }
});

define(
    'spoopy.game',
    ['jquery', 'underscore', 'pubsub', 'spoopy.rooms', 'spoopy.items', 'spoopy.player', 'spoopy.engine',],
    ($, _, PS, rooms, items, Player, Engine) => {
    
        this.available = _.range(25);
        this.player = new Player();
        this.engine = new Engine(this.available);

        $(document).ready(() => {

            let gen_params = {
                start: {
                    loc: 0,
                    min_branches: 3,
                    max_branches: 6,
                },

                gens: 1,
                gens_fn: function() { return _.random(1,3); },
            };

            this.engine.engine_build_map(gen_params);
            engine_update_main(this.player);
/*
            _.mapObject(
                rooms.rooms,
                room => $('#nav ul').append(build_room_nav_link(room.name))
            );
*/
        });

        let build_room_nav_link = (_text) => {
            return $('<li>').html($('<a>', {
                text: _text,
                href: '#',
                click: () => PS.publish('ENGINE_NAV_CLICK', _text)
            }));
        };

        let engine_update_main = (player) => {
            $('#header h1').text(player.loc);
            $('#content p').text(rooms.get_description(player.loc));

/* TODO: Show buttons only for current room connections.
            $('#nav ul').empty();
            _.mapObject(
                _.filter(rooms.rooms),
                room => $('#nav ul').append(build_room_nav_button(room))
            );
*/
        };

        let engine_nav_handler = (channel, msg) => engine_update_main(this.player);
        let engine_nav_handler_sub = PS.subscribe('ENGINE_NAV_CLICK', engine_nav_handler);
});