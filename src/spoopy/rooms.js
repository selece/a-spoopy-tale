import { map, chain, find, isEqual } from 'lodash';
import Loader from './loader';

export default class RoomDB {
  constructor() {
    this.rooms = new Loader(
      [
        'atrium.json',
        'attic.json',
        'ballroom.json',
        'bathroom.json',
        'billiard.json',
        'boudoir.json',
        'cloakroom.json',
        'conservatory.json',
        'cryptoporticus.json',
        'dining.json',
        'drawing.json',
        'foyer.json',
        'furnace.json',
        'gallery.json',
        'guestbedroom.json',
        'kitchen.json',
        'larder.json',
        'laundry.json',
        'library.json',
        'masterbedroom.json',
        'music.json',
        'nursery.json',
        'observatory.json',
        'pantry.json',
        'parlour.json',
        'rotunda.json',
        'servantshall.json',
        'servantsquarters.json',
        'staircasetower.json',
        'study.json',
        'trophy.json'
      ],
      './data/rooms/'
      // path is relative to loader.js location!
    ).res;

    this.unexplored = [
      "You can't quite seem to pierce the inky darkness beyond the doorway.",
      'A mysterious corridor leads off into the distance.',
      'Your eyes are unable to see beyond the layers of dust and cobwebs and into the room beyond.',
      "Try as you might, you can't see anything beyond this doorway.",
      'All you can discern is the creaking door and indistinct shapes in the dark room ahead.',
      'The room beyond the doorway lies in shadow.',
      'You peer through the doorway, but cannot make out what lies beyond.',
      "You don't know where this door leads.",
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
      "You won't know what lies past this door until you open it.",
      'The door hangs open crookedly. The next room is silent.',
      'The doorway gives no indication of which room lies beyond it.',
      'You see the threshold of another room.',
      'Another room adjoins this one.',
      'An archway leads to another room.',
      "A door leads to another of the house's rooms.",
      'The doorway is shadowed.',
      'You cannot see which room lies in this direction.'
    ];
  }

  exists(search) {
    return (
      find(this.rooms, {
        name: search
      }) !== undefined
    );
  }

  get randomUnexplored() {
    return chain(this.unexplored)
      .sampleSize()
      .head()
      .value();
  }

  get roomsByName() {
    return map(this.rooms, 'name');
  }

  getDescription(search, conditions = {}) {
    const target = find(this.rooms, {
      name: search
    });

    if (target) {
      const filteredConditions = chain(target.descriptions)
        .filter(desc => isEqual(desc.conditions, conditions))
        .value();

      if (filteredConditions.length) {
        return chain(filteredConditions)
          .sampleSize()
          .head()
          .value().text;

        // return sample(filteredConditions).text;
      }

      return chain(target.descriptions)
        .filter(desc => isEqual(desc.conditions, {}))
        .sampleSize()
        .head()
        .value().text;
    }

    throw new Error(`Could not find room: ${search}.`);
  }
}
