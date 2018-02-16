'use strict';

// define global config block for require
require.config({
    paths: {
        'jquery': '../jquery.min',
        'underscore': '../underscore.min',
    }
});

define(
    'spoopy.game',
    ['jquery', 'underscore', 'spoopy.rooms', 'spoopy.items', 'spoopy.player', 'spoopy.engine',],
    ($, _, rooms, items, Player, Engine) => {
    
        this.available = rooms.get_name_list();
        this.player = new Player();
        this.engine = new Engine(this.available);

        $(document).ready(() => {

            let gen_params = {
                start: {
                    loc: 'Foyer',
                    min_branches: 3,
                    max_branches: 6,
                },

                gens: 1,
                gens_fn: function() { return _.random(1,3); },
                leaf_connections: 3,
            };

            this.engine.build_map(gen_params);
            display_update();
        });

        let display_update = function() {
/*
            $('#header h1').text(this.player.loc);
            $('#content p').text(rooms.get_description(this.player.loc));

            $('#nav ul').empty();
            _.mapObject(
                this.engine.get_map_at(this.player.loc),
                elem => $('#nav ul').append(
                    build_nav_link(
                        elem, this.player.visited(elem)
                    )
                )
            );
*/
        };

        let build_nav_link = (_link_text, _visited) => {
            return $('<li>').html($('<a>', {
                text: _visited ? _link_text : 'A dark and mysterious doorway...',
                href: '#',
            }));
        };
});
