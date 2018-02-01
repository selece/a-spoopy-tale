'use strict';

// define global config block
require.config({
    paths: {
        'jquery': '../jquery.min',
        'underscore': '../underscore.min',
    }
});

define(['jquery', 'underscore', 'spoopy.data.rooms'], ($, _, rooms) => {
    let current_room = 'Foyer';
    
    $(document).ready(() => {
        $('#header h1').text(current_room);
        $('#content p').text(rooms.get_description(current_room));

        _.mapObject(rooms.rooms, (room) => {
            $('#nav ul').append(`<li><a href="#">${room.name}</a></li>`);
        });
    });
});