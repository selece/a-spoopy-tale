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

    return (
      <div className={classNames(classes)}>
        {render[renderName].map(btn => (
          <Button
            display={btn.display}
            onClickHandler={btn.onClickHandler}
            onMouseEnter={btn.onMouseEnterHandler}
            onMouseLeave={btn.onMouseLeaveHandler}
            key={generate()}
            classes={btn.classes}
          />
        ))}
      </div>
    );
  }
}
