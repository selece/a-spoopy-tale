import {filter, contains, sample, chain, range, isFunction, random} from 'underscore';

import Player from './player';
import ItemDB from './items';
import RoomDB from './rooms';

export default class Engine {
	constructor() {
		this.player = new Player();
		this.itemDB = new ItemDB();
		this.roomDB = new RoomDB();

		this.adjacency = {};
		this.exclusions = [];
		this.available = this.roomDB.room_names;
	}

	getRoom(params=undefined) {
		let filtered = params === undefined ?
			filter(
				this.available,
				
				// NOTE: this context below is the context provided, not the Engine object
				function(i) { return !contains(this.exc, i); },
				{ exc: this.exclusions }
			
			) : filter(
				params.use_list,
				params.filter_function,
				params.context
			);

		if (filtered.length > 0) {
			return sample(filtered);
		} else {
			console.error('getRoom(): no valid rooms available');
			return undefined;
		}
	}

	updateExclusions(update) {
		this.exclusions = chain(
			this.exclusions
		).union(update)
		 .unique()
		 .value();
	}

	updateAdjacency(from, to) {
		if (from === undefined || to === undefined) {
			console.error('updateAdjacency(): cannot update adjacency to undefined');
			return;
		}

		if (this.adjacency[from] === undefined) { this.adjacency[from] = []; }
		if (this.adjacency[to] === undefined) { this.adjacency[to] = []; }

		if (!contains(this.adjacency[from], to)) { this.adjacency[from].push(to); }
		if (!contains(this.adjacency[to], from)) { this.adjacency[to].push(from); }
	}

	getBranches(trunk) {
		return chain(this.adjacency)

				// NOTE: this refers to context provided, not Engine object
				.filter(function(i) { return i.toString() !== this.t.toString(); }, {t: trunk})
				.first()
				.value();
	}

	getAdjacencyAt(loc) {
		return this.adjacency[loc];
	}

	buildMapAt(loc, branches) {
		this.updateExclusions([loc]);
		for (let i in range(
			isFunction(branches) ? branches() : branches
		)) {
			
			let pick = this.getRoom();

			if (pick === undefined) {
				break;
			} else {
				this.updateAdjacency(loc, pick);
				this.updateExclusions([pick]);
			}
		}
	}

	connectLeaves(leaves) {
		let leaf_params = {
			use_list: this.exclusions,
			filter_function: function(i) {
				return this.adj[i].length === 1 && !contains(this.exc, i);
			},
			context: {adj: this.adjacency, exc: []}
		};

		// TODO: connect n-random number of leaves, rather than just pairs?
		for (let i in range(leaves)) {
			let leaf_1 = this.getRoom(leaf_params);
			leaf_params.context.exc.push(leaf_1);
			let leaf_2 = this.getRoom(leaf_params);

			this.updateAdjacency(leaf_1, leaf_2);
			console.log('connectLeaves(): picked', leaf_1, leaf_2, '->', this.adjacency);
		}
	}

	// TODO: make recursive for n-generations
	// NOTE: for now, we just do one generation of branches
	buildMap(params) {
		this.buildMapAt(
			params.start.loc,
			random(
				params.start.min_branches,
				params.start.max_branches
			)
		);

		console.log('buildMap(): root complete ->', this.adjacency, this.exclusions);
		console.log('buildMap(): branches @', params.start.loc, this.getBranches(params.start.loc));

		let branches = this.getBranches(params.start.loc);
		for (let i in range(params.branches.gens)) {
			console.log('buildMap(): building generation', i);

			for (let j in branches) {
				this.buildMapAt(
					branches[j],
					random(
						params.branches.min_branches,
						params.branches.max_branches
					)
				);
			}
		}

		this.connectLeaves(params.leaf_connections);
		console.log('buildMap(): completed!', this.adjacency, this.exclusions);
	}
}
