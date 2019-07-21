import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import './Button.scss';

export default
@observer
class Button extends React.Component {
  render() {
    const {
      classes,
      display,
      onClickHandler,
      onMouseEnterHandler,
      onMouseLeaveHandler
    } = this.props;

    // NOTE: mobx makes arrays into observables, so we have to toJS() classes
    return (
      <div
        role="button"
        tabIndex={0}
        className={classNames(toJS(classes))}
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
