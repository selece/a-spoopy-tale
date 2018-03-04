import {findWhere, sample, filter, isEqual, pluck, chain, contains} from 'underscore';

import Loader from './loader';
export default class ItemDB {
    constructor() {
        this.items = new Loader(
            [
                'skull.json',
                'tome.json',
            ],
            './data/items/'
            // path is relative to loader.js location!
        ).res;
    }

    get item_names() {
        return pluck(this.items, 'name');
    }

    random_item(exclude) {
        return chain(this.items)
            .filter(item => !contains(exclude, item))
            .sample()
            .value();
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
