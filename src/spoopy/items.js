'use strict';

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

    item(search) {
        if (this.exists(search)) {
            return chain(this.items)
                .filter(item => item.name === search)
                .first()
                .value();
        } else {
            throw new Error(`Item does not exist: ${search}.`);
        }
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
        const target = findWhere(this.items, {name: search});
        if (target) {
            
            const filteredConditions = filter(
                target.descriptions,
                desc => isEqual(desc.conditions, conditions)
            );

            if (filteredConditions.length) {
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
