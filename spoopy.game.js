'use strict';

let rooms = {
    'Foyer': {
        'descriptions': [
            'A musty smell fills your nostrils as you survey the dust-covered entranceway.',
            'The floorboards creak with an unearthly groan as you carefully step into the crumbling foyer.'
        ],    
    },

    'Kitchen': {
        'descriptions': [
            'The faint smell of rot wafts towards you. Nothing edible has been prepared here for a long time.',
        ]
    },

    'Conservatory': {
        'descriptions': [
            'Long-dead leaves crunch beneath your shoes as you explore the empty conservatory.',
            'The peeling plaster walls and cracked glass windows fill your view.',
        ]
    },
};

let items = {
    'Skull': {
        'description': 'The hollow eyes and broken teeth leer at you with an oddly jovial grin.',
    },
};

$(document).ready(() => {
    let current_room = 'Foyer';

    $('#header h1').text(current_room);
    $('#content p').text(get_description(current_room, rooms));
});

function get_description(search, obj_array) {
    if (obj_array[search] !== undefined) {
        let description = _.sample(obj_array[search].descriptions);
        return description;

    } else {
        console.error('get_description(): ', search, ' not found in ', obj_array);
        return null;
    }
}