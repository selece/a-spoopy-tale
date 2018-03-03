import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import './DisplayText.scss'

@observer
export default class DisplayText extends React.Component {
    render() {
        return (
            <p className={classNames(this.props.classes)}>
                {this.props.render[this.props.renderName]}
            </p>
        );
    }
}