import React from 'react';
import {observer} from 'mobx-react';

import DisplayLocation from './Display/DisplayLocation/DisplayLocation.jsx';
import DisplayDescription from './Display/DisplayDescription/DisplayDescription.jsx';
import ButtonGrid from './ButtonGrid/ButtonGrid.jsx';

import './GUIRoot.scss';
 
// import {Motion, spring} from 'react-motion';
// import {classNames} from 'classnames';
// import $ from 'jquery';
// import * from '../vendor/jquery.lettering.js';

@observer export default class GUIRoot extends React.Component {
    render() {
        const engineRef = this.props.engineRef;
        const gameState = this.props.engineRef.gameState;

        return (
            <div id='GUIRoot' className='center'>
                <DisplayLocation gameState={gameState} />
                <DisplayDescription gameState={gameState} />

                <ButtonGrid buttons={gameState.guiRender.propButtonGridExits} />
            </div>
        );
    }
}