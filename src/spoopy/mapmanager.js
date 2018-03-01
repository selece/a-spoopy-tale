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
        if (from === undefined || to === undefined) {
            throw new Error(`Cannot connect ${from} and ${to}.`);
        }

        if (this.adjacency[from] === undefined || this.adjacency[to] === undefined) {
            throw new Error(`Cannot connect ${from} and ${to}, one or both are undefined in adjacency.`);
        }

        this.adjacency[from].push(to);
        if (!unidirectional) { this.adjacency[to].push(from); }

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
        let filtered = (params === undefined) ?

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

        for (let i in range(branches)) {
            let picks = this.random();

            if (picks === undefined) {
                break;
            } else {
                picks.map(item => this.add(item));
                picks.map(item => this.connect(at, item));
            }
        }

        // if we're doing leaf connetions...
        // NOTE: we have to set params here, not at the top because
        // this will be AFTER the used/adjacency lists are updated
        if (connects !== 0) {
            let params = {
                available: this.used,
                operator: (room) => this.adjacency[room].length === 1, 
            }
    
            for (let i in range(connects)) {
                let leaves = this.random(2, params);
                
                if (leaves === undefined) {
                    break;
                } else {
                    let [a, b] = leaves; 
                    this.connect(a, b);
                }
            }
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
        let current = params.start.loc;
        for (let i in range(params.branches.generations)) {
            for (let branch in this.adjacency[current]) {
                this.build(
                    this.adjacency[current][branch], 
                    random(params.branches.min_branches, params.branches.max_branches),
                    params.branches.connects
                );
            }
        }
    }
}