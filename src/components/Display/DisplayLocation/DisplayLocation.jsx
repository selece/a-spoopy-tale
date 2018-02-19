import React from 'react';
import {observer} from 'mobx-react';

import './DisplayLocation.scss';

@observer
export default class DisplayLocation extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.gameState.guiRender.propDisplayLocation}</h1>
            </div>
        );
    }
}