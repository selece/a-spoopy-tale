import React from 'react';
import {observer} from 'mobx-react';
import classNames from 'classnames';

import './Button.scss';

@observer
export default class Button extends React.Component {
    render() {
        return (
            <div 
                className={classNames(this.props.classes)}
                onClick={this.props.onClickHandler}
                onMouseEnter={this.props.onMouseEnterHandler}
                onMouseLeave={this.props.onMouseLeaveHandler}
            >

                <p>{this.props.display}</p>

            </div>
        );
    }
}