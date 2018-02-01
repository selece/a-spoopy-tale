define([], () => {
    let rooms = [
        {
            'name': 'Foyer',
            'descriptions': [
                {
                    'text': 'A musty smell fills your nostrils as you survey the dust-covered entranceway.',
                    'conditions': false,
                },
                {
                    'text': 'The floorboards creak with an unearthly groan as you carefully step into the crumbling foyer.',
                    'conditions': false,
                },
            ],
            'tags': false,
        },
        {
            'name': 'Kitchen',
            'descriptions': [
                {
                    'text': 'The faint smell of rot wafts towards you. Nothing edible has been prepared here for a long time.',
                    'conditions': false,
                }
            ],
            'tags': false,
        },
        {
            'name': 'Conservatory',
            'descriptions': [
                {
                    'text': 'Long-dead leaves crunch beneath your shoes as you explore the empty conservatory.',
                    'conditions': false,
                },
                {
                    'text': 'The peeling plaster walls and cracked glass windows fill your view.',
                    'conditions': false,
                }
            ],
            'tags': false,
        },
    ];

    let get_description = function get_description(search, conditions=false) {
        let target = _.findWhere(rooms, {name: search});
        if (target !== undefined) {
            return _.sample(_.where(target.descriptions, {conditions: conditions})).text;

        } else {
            console.error('get_description(): ', search, ' not found in ', rooms);
            return null;
        }
    };

    return {
        rooms: rooms,
        get_description: get_description,
    };
});