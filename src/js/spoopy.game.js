'use strict';

// define global config block
require.config({
    paths: {
        'jquery': '../jquery.min',
        'underscore': '../underscore.min',
        'pubsub': '../pubsub',
    }
});

define(
    ['jquery', 'underscore', 'pubsub', 'spoopy.rooms', 'spoopy.items', 'spoopy.player', 'spoopy.engine',],
    ($, _, PS, rooms, items, Player, Engine) => {
    
        this.available = _.range(25);
        this.player = new Player();
        this.engine = new Engine(this.available);

        $(document).ready(() => {

            this.engine.engine_build_map(0);
/*
            _.mapObject(
                rooms.rooms,
                room => $('#nav ul').append(build_room_nav_link(room.name))
            );
*/
        });

        let build_room_nav_link = (_text) => {
            return $('<li>').html($('<a>', {
                text: _text,
                href: '#',
                click: () => PS.publish('ENGINE_NAV_CLICK', _text)
            }));
        };
/*
// TODO: Need to build this thing. :/
// NOTE: Lots of trying stuff going on in here...
        let engine_get_room = (_available, _exclusions) => {

            // console.log('engine_get_room(): exc ->', _exclusions);

            let filtered = _.filter(
                _available,

                // NOTE: the provided context {} looks messy, but removes the jshint
                // warning about function accessing outer scoped variables

                // NOTE: not sure why but using an arrow func. here breaks the filter
                // and causes it to pass duplicate values?
                function(elem) {
                    return !(this._.contains(this.exc, elem));
                },
                {
                    exc: _exclusions,
                    _: _,
                }
            );

            if (filtered.length > 0) {
                let draw = _.sample(filtered);
                console.log('engine_get_room(): got ', draw);
                return draw;

            } else {
                console.error('engine_get_room(): no valid rooms');
                return undefined;
            }
        };

        let engine_update_exclusions = (_existing, _update) => {
            return _.chain(_existing)
                    .union(_update)
                    .unique()
                    .value();
        };

        let engine_update_adjacency = (_adjacency, _start, _end) => {
            if (_adjacency[_start] === undefined) {
                _adjacency[_start] = [];
            }

            if (_adjacency[_end] === undefined) {
                _adjacency[_end] = [];
            }

            _adjacency[_start].push(_end);
            _adjacency[_end].push(_start);
            _adjacency[_start] = _.unique(_adjacency[_start]);
            _adjacency[_end] = _.unique(_adjacency[_end]);

            return _adjacency;
        };

        let engine_get_branches = (_trunk, _adjacency) => {
            return _.chain(_adjacency)
                    .filter(function(elem) { return elem.toString() !== this.t.toString(); }, {t: _trunk})
                    .first()
                    .value();
        };

        let engine_build_at = (_start, _branch_count, _available, _exclusions, _adjacency) => {
            for (let i in _.range(
                _.isFunction(_branch_count) ? _branch_count() : _branch_count
            )) {

                let pick = engine_get_room(_available, _exclusions);

                if (pick === undefined) {
                    console.error('engine_build_at(): could not get available room for pick');
                    break;
                
                } else {
                    _adjacency = engine_update_adjacency(_adjacency, _start, pick);
                    _exclusions = engine_update_exclusions(_exclusions, [pick]);
                } 
            }

            return {
                updated_adjacency: _adjacency,
                updated_exclusions: _exclusions,
            };
        };

        // NOTE: scope issue - might have to scope vars to global/persistent object        
        let engine_build_map = (_start, _adjacency, _exclusions, _available) => {

            console.log('engine_build_map():', _adjacency, _exclusions);
            _exclusions = engine_update_exclusions(_exclusions, [_start]);

            let gen = engine_build_at(_start, _.random(3,6), _available, _exclusions, _adjacency);
            _adjacency = gen.updated_adjacency;
            _exclusions = gen.updated_exclusions;

            console.log('adj:', _adjacency, ' exc:', _exclusions);

            let branches = engine_get_branches(_start, _adjacency);
            console.log('branches -> trunk @ ', _start, branches);

            for (let i in branches) {
                let branch_gen = engine_build_at(branches[i], _.random(1,2), _available, _exclusions, _adjacency);

                // _adjacency = gen.updated_adjacency;
                _exclusions = gen.updated_exclusions;

                console.log('branch @ ', branches[i], ', adj:', _adjacency, ' exc:', _exclusions);
            }
        };

        let engine_update_main = (player) => {
            $('#header h1').text(player.loc);
            $('#content p').text(rooms.get_description(player.loc));

/* TODO: Show buttons only for current room connections.
            $('#nav ul').empty();
            _.mapObject(
                _.filter(rooms.rooms),
                room => $('#nav ul').append(build_room_nav_button(room))
            );

        };

        let engine_nav_handler = (channel, msg) => engine_update_main(this.player);
        let engine_nav_handler_sub = PS.subscribe('ENGINE_NAV_CLICK', engine_nav_handler);
*/
});