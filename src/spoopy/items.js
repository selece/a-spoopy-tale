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
        return findWhere(
            this.items, 
            {
                name: chain(this.items)
                .pluck('name')
                .filter(item => !contains(exclude, item))
                .sample()
                .value()
            }
        );
    }

    exists(search) {
        return findWhere(this.items, {name: search}) !== undefined;
    }

    getDescription(search, conditions={}) {
        let target = findWhere(this.items, {name: search});
        if (target !== undefined) {
            
            let filteredConditions = filter(
                target.descriptions,
                desc => isEqual(desc.conditions, conditions)
            );

            if (filteredConditions.length > 0) {
                return sample(filteredConditions).text;
            } else {
                return chain(target.descriptions)
                .filter(desc => isEqual(desc.conditions, {}))
                .sample()
                .value()
                .text;
            }

        } else {
            throw new Error(`Item not found: ${search}.`);
        }
    }
}
