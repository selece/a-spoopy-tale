import Loader from '../src/spoopy/loader';

describe('Loader', () => {
  let target;

  describe('constructor', () => {
    beforeEach(() => {
      target = new Loader(['loader.test.json'], '../../test/');
    });

    test('inits parameters to expected values', () => {
      expect(target.path).toEqual('../../test/');
      expect(target.files).toEqual(['loader.test.json']);
      expect(target.loaded).toEqual([
        {
          name: 'Test Fixture',
          data: {
            prop1: 'prop1data',
            prop2: ['prop2-array-01', 'prop2-array-02']
          }
        }
      ]);
    });
  });

  describe('res()', () => {
    beforeEach(() => {
      target = new Loader(['loader.test.json'], '../../test/');
    });

    test('returns loaded results', () => {
      expect(target.res).toEqual([
        {
          name: 'Test Fixture',
          data: {
            prop1: 'prop1data',
            prop2: ['prop2-array-01', 'prop2-array-02']
          }
        }
      ]);
    });
  });
});
