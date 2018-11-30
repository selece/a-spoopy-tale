import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import './Button.scss';

export default
@observer
class Button extends React.Component {
  render() {
    // this.props.classes converted to an observable - access it through $mobx.values or mobx.toJS
    const { classes } = this.props;
    const {
      display,
      onClickHandler,
      onMouseEnterHandler,
      onMouseLeaveHandler
    } = this.props;
    return (
      <div
        role="button"
        tabIndex={0}
        className={classNames(classes)}
        onClick={onClickHandler}
        onKeyUp={onClickHandler}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        <p>{display}</p>
      </div>
    );
  }
}
