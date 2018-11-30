import RoomDB from '../src/spoopy/rooms';

describe('RoomDB', () => {
  let target;

  beforeEach(() => {
    target = new RoomDB();
  });

  describe('constructor', () => {
    test('inits properties to expected values', () => {
      expect(target.rooms.length).toBeGreaterThan(1);
      expect(target.unexplored.length).toBeGreaterThan(1);
    });
  });

  describe('exists()', () => {
    test('returns true for existing rooms', () => {
      expect(target.exists('Foyer')).toEqual(true);
    });

    test('returns false for non-existent rooms', () => {
      expect(target.exists('Bad')).toEqual(false);
    });
  });

  describe('randomUnexplored()', () => {
    test('returns a random unexplored quip', () => {
      expect(target.unexplored).toContain(target.randomUnexplored);
    });
  });

  describe('roomsByName()', () => {
    test('returns an array of the room names', () => {
      expect(target.roomsByName.length).toEqual(target.rooms.length);
    });
  });

  describe('getDescription()', () => {
    test('returns description for valid room, no conditions (Foyer)', () => {
      expect([
        'A musty smell fills your nostrils as you survey the dust-covered entranceway.',
        'The floorboards creak with an unearthly groan as you carefully step into the crumbling foyer.',
        'It isn"t hard for you to imagine the former grandeur of the decaying foyer.'
      ]).toContain(target.getDescription('Foyer'));
    });

    test('returns description for valid room, conditions applied (Foyer)', () => {
      expect(target.getDescription('Foyer', { hasItem: 'Skull' })).toEqual(
        '!!! CONDITIONAL TEST !!!'
      );
    });

    test('returns default (no condition) description for valid room when no conditions match (Foyer)', () => {
      expect([
        'A musty smell fills your nostrils as you survey the dust-covered entranceway.',
        'The floorboards creak with an unearthly groan as you carefully step into the crumbling foyer.',
        'It isn"t hard for you to imagine the former grandeur of the decaying foyer.'
      ]).toContain(target.getDescription('Foyer', { hasItem: 'Bad' }));
    });

    test('throws error for non-existent room', () => {
      expect(() => target.getDescription('Bad')).toThrow(/Could not find room/);
    });
  });
});
