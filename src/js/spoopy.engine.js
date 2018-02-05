define('spoopy.engine', ['underscore', 'jquery', 'pubsub'], (_, $, PS) => {
	'use strict';

	// constructor
	function Engine(_available) {
		if (!(this instanceof Engine)) {
			throw new TypeError('Engine constructor cannot be called as function!');
		}

		this.adjacency = {};
		this.exclusions = [];
		this.available = _available;
	}

	Engine.DEFAULT_STARTING_LOCATION = 'Foyer';

	Engine.prototype = {

		constructor: Engine,

		build_room_nav_link: function(_link_text) {
			return $('<li>').html($('<a>', {
				text: _link_text,
				href: '#',
				click: function() { PS.publish('ENGINE_NAV_CLICK', _link_text); },
			}));
		},

		get_room: function(_params) {
			let filtered_list = (_params === undefined) ?
				_.filter(
					this.available,
					function(elem) { return !(_.contains(this.exc, elem)); },
					{ exc: this.exclusions }
				) : _.filter(
					_params.use_list,
					_params.filter_function,
					_params.context
				);

			if (filtered_list.length > 0) {
				let draw = _.sample(filtered_list);
				console.log('get_room():', draw);
				return draw;

			} else {
				console.error('get_room(): no valid draw available');
				return undefined;
			}
		},

		update_exclusions: function(_upd) {
			console.log('pre-upd exc:', this.exclusions);
			this.exclusions =
				_.chain(this.exclusions)
				 .union(_upd)
				 .unique()
				 .value();

			console.log('updated exc:', this.exclusions);
		},

		update_adjacency: function(_start, _end) {
			if (_start === undefined || _end === undefined) {
				console.error('update_adjacency(): undefined is not valid for adjacency');
				return;
			}

			if (this.adjacency[_start] === undefined) { this.adjacency[_start] = []; }
			if (this.adjacency[_end] === undefined) { this.adjacency[_end] = []; }

			this.adjacency[_start].push(_end);
			this.adjacency[_end].push(_start);

			this.adjacency[_start] = _.unique(this.adjacency[_start]);
			this.adjacency[_end] = _.unique(this.adjacency[_end]);
		},

		get_branches: function(_trunk) {
			return _.chain(this.adjacency)
					.filter(function(elem) { return elem.toString() !== this.t.toString(); }, {t: _trunk})
					.first()
					.value();
		},

		build_at: function(_t, _branches) {
			this.update_exclusions([_t]);
			for (let i in _.range(
				_.isFunction(_branches) ? _branches() : _branches
			)) {

				let pick = this.get_room();

				if (pick === undefined) {
					console.log('build_at(): error, no available rooms');
					break;
				} else {
					this.update_adjacency(_t, pick);
					this.update_exclusions([pick]);
				}
			}
		},

		connect_random_leaves: function(_leaves) {
			let leaf_params = {
				use_list: this.exclusions,
				filter_function: function(elem) {
					return this.adj[elem].length === 1 && !_.contains(this.exc, elem);
				},
				context: {adj: this.adjacency, exc: []}
			};

			for (let i in _.range(_leaves)) {
				let leaf_1 = this.get_room(leaf_params);
				leaf_params.context.exc.push(leaf_1);
				console.log('connect_random_leaves(): leaf_1', leaf_1, leaf_params.context.exc);

				let leaf_2 = this.get_room(leaf_params);
				leaf_params.context.exc.push(leaf_2);
				console.log('connect_random_leaves(): leaf 2', leaf_2, leaf_params.context.exc);

				this.update_adjacency(leaf_1, leaf_2);
				console.log('connect_random_leaves(): adj', this.adjacency);
			}
		},

		build_map: function(_gen) {

			// TODO: make this recursive for deeper generation and simpler structure
			// for now, we'll go with one generation of branches

			this.build_at(
				_gen.start.loc,
				_.random(
					_gen.start.min_branches,
					_gen.start.max_branches
				)
			);

			console.log('build_map(): root complete ->', this.adjacency, this.exclusions);
			console.log('build_map(): branches @', _gen.start.loc, this.get_branches(_gen.start.loc));

			let branches = this.get_branches(_gen.start.loc); 
			for (let i in _.range(_gen.gens)) {
				console.log('build_map(): building generation', i);

				for (let j in branches) {
					console.log('build_map(): building branch @', branches[j]);
					this.build_at(branches[j], _gen.gens_fn());
				}
			}

			console.log('build_map(): done branches ->', this.adjacency, this.exclusions);
			console.log('build_map(): connecting random leaves...');

			this.connect_random_leaves(_gen.leaf_connections);
		},
	};

	return Engine;
});