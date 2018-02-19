import React from 'react';
import {observer} from 'mobx-react';

import './DisplayDescription.scss'

@observer
export default class DisplayDescription extends React.Component {
    render() {
        return (
            <p id='DisplayDescription'>{this.props.gameState.guiRender.propDisplayDescription}</p>
        );
    }
}