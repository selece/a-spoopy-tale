import Engine from './engine';

describe('Engine', () => {
    describe('constructor', () => {
        const target = new Engine({
            start: {
                loc: 'Foyer',
                min_branches: 3,
                max_branches: 6,
            },
            branches: {
                min_branches: 1,
                max_branches: 3,
                connects: 2,
                generations: 1,
            },
        });

        target._playerActions['PLAYER_MOVE']('Test');

        test('placeholder', () => {
            expect(target.player.loc).toBe('Test');
        });
    });
});