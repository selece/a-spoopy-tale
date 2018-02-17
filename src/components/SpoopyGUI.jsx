import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
export default class SpoopyGUI extends Component {
    render() {
        return (
            <h1>{this.props.player.loc}</h1>
        );
    }
}