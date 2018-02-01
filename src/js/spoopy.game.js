'use strict';

// define global config block
require.config({
    paths: {
        'jquery': '../jquery.min',
        'underscore': '../underscore.min',
    }
});

define(['jquery', 'underscore', 'spoopy.rooms', 'spoopy.items'], ($, _, rooms, items) => {
    let current_room = 'Kitchen';
    
    $(document).ready(() => {
        $('#header h1').text(current_room);
        $('#content p').text(rooms.get_description(current_room, {has_item: ['Skull']}));

        _.mapObject(rooms.rooms, (room) => {
            $('#nav ul').append(`<li><a href="#">${room.name}</a></li>`);
        });
    });
});