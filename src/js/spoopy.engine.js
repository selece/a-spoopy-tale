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

		engine_get_room: function() {
			let filtered_list = _.filter(
				this.available,
				function(elem) { return !(_.contains(this.exc, elem)); },
				{ exc: this.exclusions }
			);

			if (filtered_list.length > 0) {
				let draw = _.sample(filtered_list);
				console.log('engine_get_room():', draw);
				return draw;

			} else {
				return undefined;
			}
		},

		engine_update_exclusions: function(_upd) {
			console.log('pre-upd exc:', this.exclusions);
			this.exclusions =
				_.chain(this.exclusions)
				 .union(_upd)
				 .unique()
				 .value();

			console.log('updated exc:', this.exclusions);
		},

		engine_update_adjacency: function(_start, _end) {
			if (this.adjacency[_start] === undefined) { this.adjacency[_start] = []; }
			if (this.adjacency[_end] === undefined) { this.adjacency[_end] = []; }

			this.adjacency[_start].push(_end);
			this.adjacency[_end].push(_start);

			this.adjacency[_start] = _.unique(this.adjacency[_start]);
			this.adjacency[_end] = _.unique(this.adjacency[_end]);
		},

		engine_get_branches: function(_trunk) {
			return _.chain(this.adjacency)
					.filter(function(elem) { return elem.toString() !== this.t.toString(); }, {t: _trunk})
					.first()
					.value();
		},

		engine_build_at: function(_t, _branches) {
			this.engine_update_exclusions([_t]);
			for (let i in _.range(
				_.isFunction(_branches) ? _branches() : _branches
			)) {

				let pick = this.engine_get_room();

				if (pick === undefined) {
					console.log('engine_build_at(): error, no available rooms');
					break;
				} else {
					this.engine_update_adjacency(_t, pick);
					this.engine_update_exclusions([pick]);
				}
			}
		},

		engine_build_map: function(_gen) {
			this.engine_build_at(
				_gen.start.loc,
				_.random(
					_gen.start.min_branches,
					_gen.start.max_branches
				)
			);

			console.log('engine_build_map(): root complete ->', this.adjacency, this.exclusions);
			console.log('engine_build_map(): branches @', _gen.start.loc, this.engine_get_branches(_gen.start.loc));

			let branches = this.engine_get_branches(_gen.start.loc); 
			for (let i in _.range(_gen.gens)) {
				console.log('engine_build_map(): building generation', i);

				for (let j in branches) {
					console.log('engine_build_map(): building branch @', branches[j]);
					this.engine_build_at(branches[j], _gen.gens_fn());
				}
			}

			console.log('engine_build_map(): done branches ->', this.adjacency, this.exclusions);
		},
	};

	return Engine;
});