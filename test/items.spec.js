import ItemDB from '../src/spoopy/items';

describe('ItemDB', () => {
    let target;

    beforeEach(() => {
        target = new ItemDB();
    })

    describe('constructor', () => {
        test('data init to expected values', () => {
            expect(target.items.length).toBeGreaterThanOrEqual(1);    
        });
    });

    describe('item_names()', () => {
        test('returns list of item names', () => {
            expect(target.item_names.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('random_item()', () => {
        test('returns a random item', () => {
            const res = target.random_item([]);
            expect(['Skull', 'Tome']).toContain(res.name);
        });

        test('returns a random item using exclusion list', () => {
            const res = target.random_item(['Skull']);
            expect(res.name).toBe('Tome');
        });
    });

    describe('exists()', () => {
        test('returns true for exisiting items', () => {
            expect(target.exists('Skull')).toBe(true);
        });

        test('returns false for non-existent items', () => {
            expect(target.exists('Bad')).toBe(false);
        });
    });

    describe('getDescription()', () => {
        test('returns expected description for no conditions (Skull)', () => {
            expect(target.getDescription('Skull')).toEqual(
                'The hollow eyes and broken teeth leer at you with an oddly jovial grin.'
            );
        });

        test('returns expected description for conditions (Skull)', () => {
            expect(
                target.getDescription(
                    'Skull',
                    { atLoc: 'Foyer' }
            )).toEqual(
                '!!! CONDITIONAL TEST !!!'
            );
        });

        test('returns default description when conditions are not met', () => {
            expect(
                target.getDescription(
                    'Skull',
                    { atLoc: 'Maze' }
            )).toEqual(
                'The hollow eyes and broken teeth leer at you with an oddly jovial grin.'
            );
        });

        test('throws error for non-existent item', () => {
            expect(
                () => target.getDescription('Bad')
            ).toThrowError(/Item not found/);
        });
    });
});