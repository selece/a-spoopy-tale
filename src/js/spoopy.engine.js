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

	Engine.prototype.constructor = Engine;

	function build_room_nav_link(_link_text) {
		return $('<li>').html($('<a>', {
			text: _link_text,
			href: '#',
			click: () => PS.publish('ENGINE_NAV_CLICK', _link_text),
		}));
	}

	Engine.prototype.engine_get_room = function() {
		let filtered_list = _.filter(
			this.available,

			// NOTE: the provided context looks messy but clears the jshint
			// warning about function accessing outer scoped variable
			elem => { return !(this._.contains(this.exc, elem)); },
			{ exc: this.exclusions, _: _ }
		);

		if (filtered_list.length > 0) {
			let draw = _.sample(filtered_list);
			return draw;

		} else {
			return undefined;
		}
	};

	Engine.prototype.engine_update_exclusions = function(_upd) {
		return _.chain(this.exclusions)
				.union(_upd)
				.unique()
				.value();
	};

	Engine.prototype.engine_update_adjacency = function(_start, _end) {
		if (this.adjacency[_start] === undefined) { this.adjacency[_start] = []; }
		if (this.adjacency[_end] === undefined) { this.adjacency[_end] = []; }

		this.adjacency[_start].push(_end);
		this.adjacency[_end].push(_start);

		this.adjacency[_start] = _.unique(this.adjacency[_start]);
		this.adjacency[_end] = _.unique(this.adjacency[_end]);
	};

	Engine.prototype.engine_get_branches = function(_trunk) {
		return _.chain(this.adjacency)
				.filter(function(elem) { return elem.toString() !== this.t.toString(); }, {t: _trunk})
				.first()
				.value();
	};

	Engine.prototype.engine_build_at = function(_t, _branches) {
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
	};

	Engine.prototype.engine_build_map = function(_t) {
		this.engine_update_exclusions([_t]);
		console.log('engine_build_map(): start ->', this.adjacency, this.exclusions);

		this.engine_build_at(_t, 4);
		console.log('engine_build_map(): complete ->', this.adjacency, this.exclusions);
	};

	return Engine;
});