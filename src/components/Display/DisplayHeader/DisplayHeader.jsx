import React from 'react';
import { observer } from 'mobx-react';

import './DisplayHeader.scss';

@observer
export default class DisplayHeader extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.render[this.props.renderName]}</h1>
            </div>
        );
    }
}