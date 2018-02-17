import {findWhere, sample, filter, isEqual} from 'underscore';

export default class ItemDB {
    constructor() {
        this.items = [
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
    }

    exists(search) {
        return findWhere(this.items, {name: search}) !== undefined;
    }

    getDescription(search, conditions={}) {
        let target = findWhere(this.items, {name: search});
        if (target !== undefined) {
            return sample(
                filter(
                    target.descriptions,
                    i => isEqual(i.conditions, conditions)
                )
            ).text || 'Error! Could not load a valid description.';
        
        } else {
            console.error('getDescription():', search, 'not found in', this.items);
            return 'Error! No valid descriptions for' + search;
        }
    }
}
