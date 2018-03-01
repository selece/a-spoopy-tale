'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import GUIRoot from './components/GUIRoot.jsx';

import Engine from './spoopy/engine';

import './globals.scss';

let engine = new Engine({
    start: {
        loc: 'Foyer',
        min_branches: 3,
        max_branches: 5,
    },

    branches: {
        generations: 1,
        min_branches: 1,
        max_branches: 3,
        connections: 4,
    },
});

ReactDOM.render(
    <GUIRoot GUIState={engine.GUIState} />,
    document.getElementById('root')
);
