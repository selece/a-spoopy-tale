'use strict';

module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest'
  }
};
