'use strict';

// define global config block
require.config({
    paths: {
        'jquery': '../jquery.min',
        'underscore': '../underscore.min',
        'pubsub': '../pubsub',
    }
});

define(
    ['jquery', 'underscore', 'pubsub', 'spoopy.rooms', 'spoopy.items', 'spoopy.player',],
    ($, _, PS, rooms, items, Player) => {
    
        this.player = new Player();

        $(document).ready(() => {
            engine_update_main(this.player);

            _.mapObject(
                rooms.rooms,
                room => $('#nav ul').append(build_room_nav_link(room))
            );
        });

        let build_room_nav_link = (room) => {
            return $('<li>').html($('<a>', {
                text: room.name,
                href: '#',
                click: () => PS.publish('ENGINE_NAV_CLICK', room.name)
            }));
        };

// TODO: Need to build this thing. :/
// NOTE: Lots of trying stuff going on in here...
        let engine_get_room = (available, exclusions) => {
            let draw;

            console.log('engine_get_room():', exclusions);

            while (draw === undefined) {

                let filtered = _.filter(
                    available,

                    // NOTE: the provided context {} looks messy, but removes the jshint
                    // warning about function accessing outer scoped variables
                    function(elem) {
                        return !(this._.contains(this.exc, elem));
                    },
                    {
                        exc: exclusions,
                        _: _,
                    }
                );

                if (filtered.length > 0) {
                    draw = _.sample(filtered) || undefined;

                } else {
                    console.error('engine_get_room(): no valid rooms');
                    break;
                }
            }

            console.log('engine_get_room():', _.contains(exclusions, draw), draw);

            return draw;
        };

        let engine_generate_room_connections = (start, conns, available, exclusions) => {

            let connections = [];
            let local_excludes = [start];

            for (let i in _.range(conns)) {
                let new_conn = engine_get_room(available, _.union(local_excludes, exclusions));

                if (new_conn !== undefined) {
                    connections.push(new_conn);
                    local_excludes.push(new_conn);

                    console.log('engine_generate_room_connections():', new_conn, local_excludes);

                } else {
                    console.error('engine_generate_room_connections(): undefined from new_conn generator.');
                }
            }

            return {
                connections: connections,
                exclusions: _.union(exclusions, local_excludes),
            };
        };

        let engine_generate_missing_edges = (room_map, target_node) => {

            console.log('engine_generate_missing_edges(): looking at', room_map[target_node]);
            for (let node in room_map[target_node]) {
                let node_val = room_map[target_node][node];
                console.log('engine_generate_missing_edges(): building missing edges for', node_val);
                if (!_.has(room_map, node_val)) {
                    room_map[node_val] = [];
                }

                if (!_.find(room_map[node_val], target_node)) {
                    room_map[node_val].push(target_node);
                } else {
                    console.log('engine_generate_missing_edges(): edge already exists');
                }
            }
        };

        let engine_build_map = (rooms) => {
            let room_list = _.range(10);
            let room_map = {};
            let exclusions = [];
            let start = 0;

            let gen1 = engine_generate_room_connections(start, _(4), room_list, []);
            room_map[start] = gen1.connections;
            engine_generate_missing_edges(room_map, start);

            console.log(room_map);
        };

        engine_build_map(rooms.rooms);

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