import {findWhere, chain, sample, filter, isEqual, pluck} from 'underscore';

export default class RoomDB {

    constructor() {
        this.rooms = [
            {
                'name': 'Atrium',
                'descriptions': [
                    {
                        'text': 'You gaze in awe of the intricate wrought-iron skeleton of the atrium skylight, its glass panes long-since shattered.',
                        'conditions': {},
                    },
                    {
                        'text': 'Shards of glass crunch under your feet, the remnants of skylit windows.',
                        'conditions': {},
                    },
                    {
                        'text': 'The atrium is grimy with years of exposure to the elements.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Attic',
                'descriptions': [
                    {
                        'text': 'The beams groan alarmingly under your weight, and you dare not venture further into the attic.',
                        'conditions': {},
                    },
                    {
                        'text': 'You cough, the air of the attic thick with dust.',
                        'conditions': {},
                    },
                    {
                        'text': 'You gaze uncertainly at the trunks and cloth-covered shapes filling the attic, wondering what memories have been lost from time.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Ballroom',
                'descriptions': [
                    {
                        'text': 'The parquet flooring is worn from the tread of a thousand pairs of shoes.',
                        'conditions': {},
                    },
                    {
                        'text': 'You twirl once, twice, in the empty ballroom, leading an imaginary partner in a waltz.',
                        'conditions': {},
                    },
                    {
                        'text': 'The ballroom is vast. Its walls bear gilded mirrors and sconces, and there is an orchestral stage in the far corner.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Bathroom',
                'descriptions': [
                    {
                        'text': 'You shudder at the grime in the cracks of the marble floor.',
                        'conditions': {},
                    },
                    {
                        'text': 'You gaze about the bathroom. A wash basin, the standard plumbing, and a large clawfoot tub.',
                        'conditions': {},
                    },
                    {
                        'text': 'Marble, wood, and cast iron lend the bathroom an air of ageold majesty.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Billiard Room',
                'descriptions': [
                    {
                        'text': 'The billiard balls lay scattered across the torn felt-top of the table.',
                        'conditions': {},
                    },
                    {
                        'text': 'Though the billiard balls are present, the table and cues have seen better days.',
                        'conditions': {},
                    },
                    {
                        'text': 'Aside from the peeling wallpaper and a thick layer of dust, the billiard room looks mostly untouched by age.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Boudoir',
                'descriptions': [
                    {
                        'text': 'The boudoir is heavily decorated with gilt and pink-striped wallpaper, though the gilt is chipped and wallpaper peeling.',
                        'conditions': {},
                    },
                    {
                        'text': 'You tread lightly into the mistress\'s private sitting room, observing the feminine decor.',
                        'conditions': {},
                    },
                    {
                        'text': 'The furniture in this room is feminine, and you discover an assortment of tarnished silver brushes and handmirrors on the dressing table.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Cloakroom',
                'descriptions': [
                    {
                        'text': 'Your feet sink into the dusty carpet of the abandoned cloakroom.',
                        'conditions': {},
                    },
                    {
                        'text': 'The few moth-eaten overcoats and fur wraps remaining in the cloakroom give off a musty smell.',
                        'conditions': {},
                    },
                    {
                        'text': 'You see nothing more than a couple of sofas and some abandoned coats.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Conservatory',
                'descriptions': [
                    {
                        'text': 'Long-dead leaves crunch beneath your shoes as you explore the empty conservatory.',
                        'conditions': {},
                    },
                    {
                        'text': 'The peeling plaster walls and cracked glass windows fill your view.',
                        'conditions': {},
                    },
                    {
                        'text': 'Wind whistles through gaps in the windows, spider-webbed with cracks.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Cryptoporticus',
                'descriptions': [
                    {
                        'text': 'Your footsteps echo hollowly as you tread along the stone hallway.',
                        'conditions': {},
                    },
                    {
                        'text': 'Several tons of stone loom over your head as you move down the hallway.',
                        'conditions': {},
                    },
                    {
                        'text': 'Great stone slabs form the hallway floor. Blocks of stone form the hallway walls. And the arched ceiling? Also stone.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Dining Room',
                'descriptions': [
                    {
                        'text': 'The long table is set as if for a feast, but every plate, dish, and cup is empty and dust-covered.',
                        'conditions': {},
                    },
                    {
                        'text': 'You gaze upon the ruins of a large dining room. Chairs lay broken, paintings hang crookedly from the walls, and the table lies set for a final meal no guest ever ate.',
                        'conditions': {},
                    },
                    {
                        'text': 'The dining room wainscotting and plaster walls are chipped and peeling, and the table and chairs rot where they stand.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Drawing Room',
                'descriptions': [
                    {
                        'text': 'The floorboards creak as you wander through the sparsely furnished drawing room.',
                        'conditions': {},
                    },
                    {
                        'text': 'Several imposing tables and stiff-backed chairs furnish the room.',
                        'conditions': {},
                    },
                    {
                        'text': 'You glance at the ecclectic mix of art on the walls as you navigate the room\'s sparse furnishings.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Foyer',
                'descriptions': [
                    {
                        'text': 'A musty smell fills your nostrils as you survey the dust-covered entranceway.',
                        'conditions': {},
                    },
                    {
                        'text': 'The floorboards creak with an unearthly groan as you carefully step into the crumbling foyer.',
                        'conditions': {},
                    },
                    {
                        'text': 'It isn\'t hard for you to imagine the former grandeur of the decaying foyer.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Furnace Room',
                'descriptions': [
                    {
                        'text': 'The furnace is a giant beast of stone and iron, surmounted by a spiderweb of pipes and ductwork.',
                        'conditions': {},
                    },
                    {
                        'text': 'You find the furnace room chillingly cold. It is decades since a fire was stoked here.',
                        'conditions': {},
                    },
                    {
                        'text': 'You spy a mountain of coal near a massive furnace.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Gallery',
                'descriptions': [
                    {
                        'text': 'The gallery is filled with statuary and portraits.',
                        'conditions': {},
                    },
                    {
                        'text': 'You walk past the silent gaze of generations of a long-forgotten family.',
                        'conditions': {},
                    },
                    {
                        'text': 'Though you are the only one in the room, the gallery feels full of people.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Guest Bedroom',
                'descriptions': [
                    {
                        'text': 'The bare floor creaks as you enter a sparse bedroom.',
                        'conditions': {},
                    },
                    {
                        'text': 'The bedroom contains only a wooden bedframe, a nightstand, and a washbasin.',
                        'conditions': {},
                    },
                    {
                        'text': 'You find the fixings of the guest bedroom rather spartan.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Kitchen',
                'descriptions': [
                    {
                        'text': 'The faint smell of rot wafts towards you. Nothing edible has been prepared here for a long time.',
                        'conditions': {},
                    },
                    {
                        'text': 'You enter what must be the kitchen, if the giant stone hearth and scorched pots are any indication.',
                        'conditions': {},
                    },
                    {
                        'text': 'The kitchen is barren. You see little beyond a sink, a countertop, some pots, and, of course, the giant stone hearth.',
                        'conditions': {},
                    },
                    {
                        'text': '!!! CONDITIONAL DESCRIPTION TEST !!! The skull almost glows with an odd glint as you enter the moudly-smelling kitchen.',
                        'conditions': { has_item: ['Skull'] },
                    },
                    {
                        'text': '!!! CONDITIONAL DESCRIPTION TEST !!! You feel the hollow eye sockets of the skull staring into you as you explore the dirty kitchen.',
                        'conditions': { has_item: ['Skull'] },
                    }
                ],
                'tags': {},
            },
            {
                'name': 'Larder',
                'descriptions': [
                    {
                        'text': 'The scent of rot and mould permeate the air in the larder.',
                        'conditions': {},
                    },
                    {
                        'text': 'The butter churn is rotten and dusty bones strewn on the floor are all that remain of the larder\'s cured meats.',
                        'conditions': {},
                    },
                    {
                        'text': 'Despite the smell of rot, you are in awe of the size of the house\'s larder.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Laundry Room',
                'descriptions': [
                    {
                        'text': 'The smell of mildew pervades your sinuses as you enter the laundry room.',
                        'conditions': {},
                    },
                    {
                        'text': 'You meander around rotting tables and washbasins.',
                        'conditions': {},
                    },
                    {
                        'text': 'Mildew and rot reign in the laundry room.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Library',
                'descriptions': [
                    {
                        'text': 'You spy hundreds upon hundreds of books and tomes, their leatherbound spines dusty and mould-ridden.',
                        'conditions': {},
                    },
                    {
                        'text': 'Motes of dust dance in your vision as you gaze upon a vast library.',
                        'conditions': {},
                    },
                    {
                        'text': 'The library is silent and oppressive with the weight of a century\'s forgotten knowledge',
                        'conditions': {},
                    }
                ],
                'tags': {},
            },
            {
                'name': 'Master Bedroom',
                'descriptions': [
                    {
                        'text': 'A canopied bed stands in the middle of the bedroom, its gauzy curtains hanging in moth-eaten shreds.',
                        'conditions': {},
                    },
                    {
                        'text': 'You gaze for awhile at the hunting scene frescoed on the ceiling above the massive bedframe.',
                        'conditions': {},
                    },
                    {
                        'text': 'You feel slightly uneasy intruding upon the long-ago master\'s private chambers.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Music Room',
                'descriptions': [
                    {
                        'text': 'You imagine hearing a ghostly sonata as you gaze upon the dust-covered piano.',
                        'conditions': {},
                    },
                    {
                        'text': 'Sheets of music have crumpled to near-dust atop the surface of the grand piano.',
                        'conditions': {},
                    },
                    {
                        'text': 'A grand piano stands in a corner of the music room. Heavy drapery along the walls adds to the heavy silence.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Nursery',
                'descriptions': [
                    {
                        'text': 'You shudder at the imagined sound of children laughing and the patter of little feet.',
                        'conditions': {},
                    },
                    {
                        'text': 'China dolls and hobby horses lay scattered, long ago abandoned.',
                        'conditions': {},
                    },
                    {
                        'text': 'Though probably much loved by their owners, you find the old-fashioned toys vaguely creepy.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Observatory',
                'descriptions': [
                    {
                        'text': 'The domain of an astronomer of old, the observatory is dominated by a gargantuan telescope of wood and iron.',
                        'conditions': {},
                    },
                    {
                        'text': 'Star charts, crumbling and faded, adorn the round walls while a telescope is prominently situated in the center of the room.',
                        'conditions': {},
                    },
                    {
                        'text': 'You step forward to try the telescope, only to find the lenses cracked beyond use.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Pantry',
                'descriptions': [
                    {
                        'text': 'You admire the neat but dusty rows of china and wineglasses in the pantry.',
                        'conditions': {},
                    },
                    {
                        'text': 'The pantry is stifling. No plates have been prepared here in some time.',
                        'conditions': {},
                    },
                    {
                        'text': 'Not a thing is out of place in this pantry. You muse that a butler must have reigned here once.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Parlour',
                'descriptions': [
                    {
                        'text': 'You decide the various couches and ottomans in the parlour look rather uncomfortable for sitting.',
                        'conditions': {},
                    },
                    {
                        'text': 'The once-vibrant upholstery of the parlour\'s furniture is now moth-eaten and sunfaded.',
                        'conditions': {},
                    },
                    {
                        'text': 'You enter the parlour, a room filled with an awkwardly placed chaise, three sofas, and two armchairs.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Rotunda',
                'descriptions': [
                    {
                        'text': 'You gaze out onto the grounds with a full 270 degrees of view.',
                        'conditions': {},
                    },
                    {
                        'text': 'The rotunda is completely empty of anything but dust.',
                        'conditions': {},
                    },
                    {
                        'text': 'You wonder at the purpose of an empty, round room.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Servants\' Hall',
                'descriptions': [
                    {
                        'text': 'You notice the wooden floor is cheap, hard, and well-scuffed.',
                        'conditions': {},
                    },
                    {
                        'text': 'The hall is furnished only by a massive wooden table and two long benches.',
                        'conditions': {},
                    },
                    {
                        'text': 'You find the lack of artwork, decoration, and comfortable furniture a little alarming.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Servants\' Quarters',
                'descriptions': [
                    {
                        'text': 'You pass room after room down the hallway. Each room holds a single bed, a wash basin, and a chest of drawers.',
                        'conditions': {},
                    },
                    {
                        'text': 'The servants\' bedrooms are overly austere.',
                        'conditions': {},
                    },
                    {
                        'text': 'You can\'t help likening the servants\' quarters to prison cells.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Staircase Tower',
                'descriptions': [
                    {
                        'text': 'Standing at the bottom, you gaze up along the spiral of the stone staircase.',
                        'conditions': {},
                    },
                    {
                        'text': 'The stone stairs have begun to crumble in some places, and you tread with extra caution.',
                        'conditions': {},
                    },
                    {
                        'text': 'You cling to the wall of the staircase, avoiding the deadly drop in the center of the spiral.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Study',
                'descriptions': [
                    {
                        'text': 'You enter the master\'s study and see a mahogany desk across from a stone fireplace.',
                        'conditions': {},
                    },
                    {
                        'text': 'The study features a stone fireplace with lamps on its lintel and a mahogany desk strewn with various odds and ends.',
                        'conditions': {},
                    },
                    {
                        'text': 'You spy a pipe and snuffbox atop the desk in the study, abandoned long decades ago.',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
            {
                'name': 'Trophy Room',
                'descriptions': [
                    {
                        'text': 'You shudder under the glass-eyed gaze of a dozen stuffed trophy heads.',
                        'conditions': {},
                    },
                    {
                        'text': 'An explorer\'s room, you decide. The room is filled with hunting trophies and curios from the depths of darkest Africa.',
                        'conditions': {},
                    },
                    {
                        'text': 'You can\'t help but notice the stuffed tiger\'s head mounted on the trophy room wall. Until you notice the rhinoceros, and the lion, and...',
                        'conditions': {},
                    },
                ],
                'tags': {},
            },
        ];

        this.unexplored = [
            'You can\'t quite seem to pierce the inky darkness beyond the doorway.',
            'A mysterious corridor leads off into the distance.',
            'Your eyes are unable to see beyond the layers of dust and cobwebs and into the room beyond.',
            'Try as you might, you can\'t see anything beyond this doorway.',
            'All you can discern is the creaking door and indistinct shapes in the dark room ahead.',
            'The room beyond the doorway lies in shadow.',
            'You peer through the doorway, but cannot make out what lies beyond.',
            'You don\'t know where this door leads.',
            'Darkness fills the room past the door.',
            'This door hangs partially ajar.',
            'You are uncertain what lies past this door.',
            'Cobwebs across the doorway obstruct your view.',
            'This door is open, showing only darkness beyond.',
            'Glancing through the doorway, you can make out only a dim room beyond.',
            'A closed door blocks your view of the room behind it.',
            'The next room is quiet and shadowed.',
            'This door is closed.',
            'A dusty door prevents you from seeing into the next room.',
            'You won\'t know what lies past this door until you open it.',
            'The door hangs open crookedly. The next room is silent.',
            'The doorway gives no indication of which room lies beyond it.',
            'You see the threshold of another room.',
            'Another room adjoins this one.',
            'An archway leads to another room.',
            'A door leads to another of the house\'s rooms.', 
            'The doorway is shadowed.',
            'You cannot see which room lies in this direction.',
        ];
    }

    exists(search) {
        return findWhere(this.rooms, {name: search}) !== undefined;
    }

    get random_unexplored() {
        return sample(this.unexplored);
    }

    get room_names() {
        /*
        return chain(this.rooms)
            .map(i => i.name)
            .value();
        */
       return pluck(this.rooms, 'name');
    }

    getDescription(search, conditions={}) {
        let target = findWhere(this.rooms, {name: search});
        if (target !== undefined) {
            return sample(
                filter(
                    target.descriptions,
                    i => isEqual(i.conditions, conditions)
                )
            ).text || 'Error! Could not load valid description.';
        
        } else {
            console.error('getDescription():', search, 'not found in', this.rooms);
            return 'Error! No valid descriptions - check conditions?';
        }
    }
}
