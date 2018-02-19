import React from 'react';
import {observer} from 'mobx-react';
import {generate} from 'shortid';

import Button from './Button/Button.jsx';

import './ButtonGrid.scss';

@observer
export default class ButtonGrid extends React.Component {
    render() {
        return (
            <div>
                {
                    this.props.buttons.map(
                        (btn) =>
                        <Button 
                            display={btn.display}
                            onClickHandler={btn.onClickHandler}
                            onClickHandlerTarget={btn.onClickHandlerTarget}
                            onMouseEnter={btn.onMouseEnterHandler}
                            onMouseLeave={btn.onMouseLeaveHandler}
                            key={generate()}
                        /> 
                    )
                }
            </div>
        );
    }
}