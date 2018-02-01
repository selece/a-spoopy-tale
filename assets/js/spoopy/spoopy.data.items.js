define(['underscore'], (_) => {
    let items = [
        {
            'name': 'Skull',
            'descriptions': [
                {
                    'text': 'The hollow eyes and broken teeth leer at you with an oddly jovial grin.',
                    'conditions': false,
                }
            ],
            'actions': false,
            'tags': false,
        }
    ];

    let get_description = function get_description(search, conditions={}) {
        let target = _.findWhere(items, {name: search});
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
            console.error('get_description(): ', search, ' not found in ', items);
            return 'Error! Could not load valid description.';
        }
    };

    return {
        items: items,
        get_description: get_description,
    };
});