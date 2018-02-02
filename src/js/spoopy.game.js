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
    
        $(document).ready(() => {
            let player = new Player();
            player.pickup_item('Socks');
            player.drop_item('Socks');

            $('#header h1').text(player.loc);
            // $('#content p').text(rooms.get_description(current_room, {has_item: ['Skull']}));
            $('#content p').text(rooms.get_description(player.loc));

            _.mapObject(
                rooms.rooms,
                room => $('#nav ul').append(build_room_nav_button(room))
            );
        });

        let engine_nav_handler = (channel, msg) => {
            console.log(channel, msg);
        };

        let engine_nav_handler_sub = PS.subscribe('ENGINE_NAV_CLICK', engine_nav_handler);

        let build_room_nav_button = (room) => {
            return $('<li>').html($('<a>', {
                text: room.name,
                href: '#',
                click: () => PS.publish('ENGINE_NAV_CLICK', room.name)
            }));
        };
});