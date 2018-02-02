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
// NOTE: http://blog.benoitvallon.com/data-structures-in-javascript/the-graph-data-structure/
// NOTE: https://www.joezimjs.com/javascript/great-mystery-of-the-tilde/
        let engine_build_map = (rooms) => {
            let room_list = [
                {
                    name: 'A',
                    exits: 3,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'B',
                    exits: 2,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'C',
                    exits: 1,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'D',
                    exits: 1,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'E',
                    exits: 2,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'F',
                    exits: 4,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'G',
                    exits: 1,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'F',
                    exits: 1,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'G',
                    exits: 2,
                    tags: {},
                    connections: [],
                },
                {
                    name: 'H',
                    exits: 2,
                    tags: {},
                    connections: [],
                }
            ];

            let engine_get_room = (available, exclusions) => {
                return _.sample(
                    _.filter(
                        available,
                        elem => !_.contains(exclusions, elem)
                    )
                ) || undefined;
            };

            let exclusions = [];
            for (let room of room_list) {
                exclusions.push(room);

                for (let i = 0; i < _.random(1, room.exits); i++) {
                    let room_draw = engine_get_room(room_list, exclusions);

                    if (room_draw !== undefined) {
                        exclusions.push(room_draw);
                        room.connections.push(room_draw);

                        let linked = room_list[_.indexOf(room_list, room_draw)];
                        linked.connections.push(room);
                    }
                }
            }

            console.log(room_list);
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