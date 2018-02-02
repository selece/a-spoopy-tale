define(['underscore'], (_) => {
    let items = [
        {
            'name': 'Skull',
            'descriptions': [
                {
                    'text': 'The hollow eyes and broken teeth leer at you with an oddly jovial grin.',
                    'conditions': {},
                }
            ],
            'actions': {},
            'tags': {},
        }
    ];

    let validate = (search) => {
        let target = _.findWhere(items, {name: search});

        if (target !== undefined) {
            return true;
        } else {
            return false;
        }
    };

    let get_description = (search, conditions={}) => {
        let target = _.findWhere(items, {name: search});
        if (target !== undefined) {
            return _.sample(
                _.filter(
                    target.descriptions,
                    elem => _.isEqual(elem.conditions, conditions)
                )
            ).text || 'Error! Could not load valid description.';

        } else {
            console.error('get_description(): ', search, ' not found in ', items);
            return 'Error! No valid descriptions found.';
        }
    };

    return {
        // acessible props
        items: items,

        // functions
        get_description: get_description,
        validate: validate,
    };
});