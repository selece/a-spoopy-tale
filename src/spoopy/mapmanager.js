'use strict';

import { filter, contains, sample, range, random, without } from 'underscore';

export default class MapManager {
    constructor(available) {
        this.available = available;

        this.used = [];
        this.adjacency = {};
        this.items = {};
    }

    exists(room) {
        return contains(this.used, room);
    }

    find(room) {
        if (!this.exists(room)) {
            throw new Error(`Cannot find room, "${room}".`);
        }

        return {
            adjacency: this.adjacency[room],
            items: this.items[room]
        }
    }

    add(room) {
        if (this.exists(room)) {
            throw new Error(`Room already exists: "${room}".`);
        }

        this.used.push(room);
        this.adjacency[room] = [];
        this.items[room] = [];
    }

    remove(room) {
        if (!this.exists(room)) {
            throw new Error(`Room does not exist: "${room}".`);
        }

        this.used = without(this.used, room);
        delete this.adjacency[room];
        delete this.items[room];
    }

    connect(from, to, unidirectional = false) {
        if (!from || !to ) {
            throw new Error(`Cannot connect ${from} and ${to}.`);
        }

        if (!this.adjacency[from] || !this.adjacency[to]) {
            throw new Error(`Cannot connect ${from} and ${to}, one or both are undefined in adjacency.`);
        }

        this.adjacency[from].push(to);
        if (!unidirectional) { 
            this.adjacency[to].push(from);
        }

        // NOTE: do we have to check if the adjacecny contains the node being added?
        // if (!contains(this.adjacency[from], to)) { this.adjacency[from].push(to); }
        // if (!contains(this.adjacency[to], from) && !unidirectional) { this.adjacency[to].push(from); }
    }

    place(item, at) {
        if (!this.exists(at)) {
            throw new Error(`Cannot place ${item} at ${at}.`);
        }

        this.items[at].push(item);
    }

    pickup(item, at) {
        if (!this.exists(at)) {
            throw new Error(`Cannot pickup ${item} at ${at}, room doesn't exist.`);
        }

        if (!contains(this.items[at], item)) {
            throw new Error(`${item} not found at ${at}.`);
        }

        this.items[at] = without(this.items[at], item);
    }

    random(count = 1, params = undefined) {
        const filtered = (params === undefined) ?

            // if no params provided, use current manager lists
            filter(this.available, room => !contains(this.used, room)) :

            // otherwise, use the provided params object lists
            filter(params.available, params.operator);

        if (filtered.length >= count) {
            return sample(filtered, count);
        } else {
            return undefined;
        }
    }

    build(at, branches, connects = 0) {
        if (!this.exists(at)) {
            throw new Error(`Can't build at ${at} - doesn't exist in map.`);
        }

        range(branches).forEach(branch => {
            const picks = this.random();

            if (picks) {
                picks.map(room => {
                    this.add(room);
                    this.connect(at, room);
                });
            }
        });

        // if we're doing leaf connetions...
        // NOTE: we have to set params here, not at the top because
        // this will be AFTER the used/adjacency lists are updated
        if (connects) {
            const params = {
                available: this.used,
                operator: (room) => this.adjacency[room].length === 1, 
            }
    
            range(connects).forEach(room => {
                const leaves = this.random(2, params);

                if (leaves) {
                    const [a, b] = leaves;
                    this.connect(a, b);
                }
            });
        }
    }

    generate(params) {
        this.add(params.start.loc);

        // build initial connections from starting location, no leaf connects
        this.build(
            params.start.loc,
            random(params.start.min_branches, params.start.max_branches)
        );

        // leaf connections from given param.start.loc based on param.branches
        const current = params.start.loc;

        range(params.branches.generations).forEach(gen => {
            this.adjacency[current].forEach(branch => {
                this.build(
                    branch,
                    random(params.branches.min_branches, params.branches.max_branches),
                    params.branches.connects
                );
            });
        });
    }
}