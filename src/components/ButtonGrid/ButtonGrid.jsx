import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { generate } from 'shortid';

import Button from './Button/Button';

import './ButtonGrid.scss';

export default
@observer
class ButtonGrid extends React.Component {
  render() {
    const { classes, render, renderName } = this.props;
    const { [renderName]: buttons } = render;

    return (
      <div className={classNames(classes)}>
        {buttons.map(btn => {
          const {
            classes: buttonClasses,
            display,
            onClickHandler,
            onMouseEnterHandler,
            onMouseLeaveHandler
          } = btn;

          return (
            <Button
              display={display}
              classes={buttonClasses}
              onClickHandler={onClickHandler}
              onMouseEnter={onMouseEnterHandler}
              onMouseLeave={onMouseLeaveHandler}
              key={generate()}
            />
          );
        })}
      </div>
    );
  }
}
