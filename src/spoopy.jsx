'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import SpoopyGUI from './components/SpoopyGUI.jsx';

import Engine from './spoopy/engine';

import './scss/main.scss';

let engine = new Engine();

engine.buildMap({
    start: {
        loc: 'Foyer',
        min_branches: 4,
        max_branches: 6,
    },

    branches: {
        gens: 1,
        min_branches: 1,
        max_branches: 3,
    },

    leaf_connections: 4,
});

ReactDOM.render(
    <SpoopyGUI player={engine.player}/>,
    document.getElementById('SpoopyGUI')
);
