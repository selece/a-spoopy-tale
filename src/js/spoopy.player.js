'use strict';

define(['spoopy.items', 'spoopy.rooms'], (items, rooms) => {
    let inventory = [];
    let map = [];
    let location = '';

    let pickup_item = item => {
        console.log('picking up', item, items.get_description(item));

        inventory.push(item); 
    };

    let drop_item = item => {
        console.log('dropping', item);

        let target = _.contains(inventory, item);
        if (target) {
            inventory = _.without(inventory, item);
        
        } else {
            console.error('drop_item(): could not drop non-existent', item);
        }
    };

    let move = loc => {
        location = loc;

        if (_.contains(map, loc)) {
            map.push(loc);
        }
    };

    return {
        // accessible props
        inventory: inventory,
        map: map,
        location: location,

        // functions
        pickup_item: pickup_item,
        drop_item: drop_item,
        move: move,
    };
});