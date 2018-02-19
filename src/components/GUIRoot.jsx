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
        const guiRender = this.props.engineRef.gameState.guiRender;

        return (
            <div id='GUIRoot' className='center'>
                <DisplayLocation guiRender={guiRender} />
                <DisplayDescription guiRender={guiRender} />

                <hr />
                <ButtonGrid buttons={guiRender.propButtonGridActions} classes='button-grid' />
                <hr />

                <ButtonGrid buttons={guiRender.propButtonGridExits} classes='button-grid' />
            </div>
        );
    }
}