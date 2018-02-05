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
    ['jquery', 'underscore', 'pubsub', 'spoopy.rooms', 'spoopy.items', 'spoopy.player',],
    ($, _, PS, rooms, items, Player) => {
    
        this.player = new Player();

        $(document).ready(() => {
            engine_update_main(this.player);

            _.mapObject(
                rooms.rooms,
                room => $('#nav ul').append(build_room_nav_link(room))
            );
        });

        let build_room_nav_link = (room) => {
            return $('<li>').html($('<a>', {
                text: room.name,
                href: '#',
                click: () => PS.publish('ENGINE_NAV_CLICK', room.name)
            }));
        };

// TODO: Need to build this thing. :/
// NOTE: Lots of trying stuff going on in here...
        let engine_get_room = (available, exclusions) => {

            console.log('engine_get_room(): exc ->', exclusions);

            let filtered = _.filter(
                available,

                // NOTE: the provided context {} looks messy, but removes the jshint
                // warning about function accessing outer scoped variables

                // NOTE: not sure why but using an arrow func. here breaks the filter
                // and causes it to pass duplicate values?
                function(elem) {
                    return !(this._.contains(this.exc, elem));
                },
                {
                    exc: exclusions,
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

        let engine_update_exclusions = (existing, update) => {
            return _.chain(existing)
                    .union(update)
                    .unique()
                    .value();
        };

        let engine_update_adjacency = (adjacency, from, to) => {
            if (adjacency[from] === undefined) {
                adjacency[from] = [];
            }

            if (adjacency[to] === undefined) {
                adjacency[to] = [];
            }

            adjacency[from].push(to);
            adjacency[to].push(from);
            adjacency[from] = _.unique(adjacency[from]);
            adjacency[to] = _.unique(adjacency[to]);

            return adjacency;
        };

        let engine_get_branches = (trunk, adjacency) => {
            return _.chain(adjacency)
                    .filter(function(elem) { return elem.toString() !== this.trunk.toString(); }, {trunk: trunk})
                    .first()
                    .value();
        };

        let engine_build_at = (start, branch_count, available, exclusions, adjacency) => {
            for (let i in _.range(
                _.isFunction(branch_count) ? branch_count() : branch_count
            )) {

                let pick = engine_get_room(available, exclusions);

                if (pick === undefined) {
                    console.error('engine_build_at(): could not get available room for pick');
                    break;
                
                } else {
                    adjacency = engine_update_adjacency(adjacency, start, pick);
                    exclusions = engine_update_exclusions(exclusions, [pick]);                    
                } 
            }

            return {
                updated_adjacency: adjacency,
                updated_exclusions: exclusions,
            };
        };

        // NOTE: scope issue - might have to scope vars to global/persistent object        
        let engine_build_map = (rooms) => {
            let room_list = _.range(15);
            let adjacency = {};
            let exclusions = [];

            let start = 0;
            exclusions = engine_update_exclusions(exclusions, [start]);

            let gen = engine_build_at(start, _.random(3,6), room_list, exclusions, adjacency);
            adjacency = gen.updated_adjacency;
            exclusions = gen.updated_exclusions;

            console.log('adj:', adjacency, ' exc:', exclusions);

            let branches = engine_get_branches(start, adjacency);
            console.log('branches -> trunk @ ', start, branches);

            for (let i in branches) {
                let branch_gen = engine_build_at(branches[i], _.random(1,2), room_list, exclusions, adjacency);
                console.log('upds -> ', gen.updated_adjacency, gen.updated_exclusions);

                adjacency = gen.updated_adjacency;
                exclusions = gen.updated_exclusions;

                console.log('branch @ ', branches[i], ', adj:', adjacency, ' exc:', exclusions);
            }
        };

        engine_build_map(rooms.rooms);

        let engine_update_main = (player) => {
            $('#header h1').text(player.loc);
            $('#content p').text(rooms.get_description(player.loc));

/* TODO: Show buttons only for current room connections.
            $('#nav ul').empty();
            _.mapObject(
                _.filter(rooms.rooms),
                room => $('#nav ul').append(build_room_nav_button(room))
            );
*/
        };

        let engine_nav_handler = (channel, msg) => engine_update_main(this.player);
        let engine_nav_handler_sub = PS.subscribe('ENGINE_NAV_CLICK', engine_nav_handler);
});