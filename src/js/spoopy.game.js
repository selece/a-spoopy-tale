'use strict';

// define global config block
require.config({
    paths: {
        'jquery': '../jquery.min',
        'underscore': '../underscore.min',
    }
});

define(
    ['jquery', 'underscore', 'spoopy.rooms', 'spoopy.items', 'spoopy.player', 'spoopy.engine.button'],
    ($, _, rooms, items, player, engine_button) => {
        let current_room = 'Kitchen';
        
        $(document).ready(() => {
            $('#header h1').text(current_room);
            // $('#content p').text(rooms.get_description(current_room, {has_item: ['Skull']}));
            $('#content p').text(rooms.get_description(current_room));

            _.mapObject(
                rooms.rooms,
                room => $('#nav ul').append(
                    `<li><a href="#">${room.name}</a></li>`
                )
            );
        });

        player.pickup_item('Skull');
        player.drop_item('Skull');
});