define(['underscore'], (_) => {
    let rooms = [
        {
            'name': 'Foyer',
            'descriptions': [
                {
                    'text': 'A musty smell fills your nostrils as you survey the dust-covered entranceway.',
                    'conditions': {},
                },
                {
                    'text': 'The floorboards creak with an unearthly groan as you carefully step into the crumbling foyer.',
                    'conditions': {},
                },
            ],
            'tags': {},
        },
        {
            'name': 'Kitchen',
            'descriptions': [
                {
                    'text': 'The faint smell of rot wafts towards you. Nothing edible has been prepared here for a long time.',
                    'conditions': {},
                },
                {
                    'text': '!!! CONDITIONAL DESCRIPTION TEST !!! The skull almost glows with an odd glint as you enter the moudly-smelling kitchen.',
                    'conditions': {has_item: ['Skull']},
                },
                {
                    'text': '!!! CONDITIONAL DESCRIPTION TEST !!! You feel the hollow eye sockets of the skull staring into you as you explore the dirty kitchen.',
                    'conditions': {has_item: ['Skull']},
                }
            ],
            'tags': {},
        },
        {
            'name': 'Conservatory',
            'descriptions': [
                {
                    'text': 'Long-dead leaves crunch beneath your shoes as you explore the empty conservatory.',
                    'conditions': {},
                },
                {
                    'text': 'The peeling plaster walls and cracked glass windows fill your view.',
                    'conditions': {},
                }
            ],
            'tags': {},
        },
    ];

    let get_description = function get_description(search, conditions={}) {
        let target = _.findWhere(rooms, {name: search});
        if (target !== undefined) {
            return _.sample(
                _.filter(
                    target.descriptions,
                    (elem) => {
                        return _.isEqual(elem.conditions, conditions);
                    }
                )
            ).text || 'Error! Could not load valid description.';

        } else {
            console.error('get_description(): ', search, ' not found in ', rooms);
            return 'Error! No valid descriptions found.';
        }
    };

    return {
        rooms: rooms,
        get_description: get_description,
    };
});