import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Button.scss';

export default
@observer
class Button extends React.Component {
  render() {
    // this.props.classes converted to an observable - access it through $mobx.values or mobx.toJS
    const { classes } = toJS(this.props);
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

function invalidButtonError() {
  throw new Error('Invalid button init.');
}

Button.defaultProps = {
  display: '!! Error: Invalid display value. !!',
  onClickHandler: invalidButtonError,
  onMouseEnterHandler: invalidButtonError,
  onMouseLeaveHandler: invalidButtonError
};

Button.propTypes = {
  display: PropTypes.string,
  onClickHandler: PropTypes.func,
  onMouseEnterHandler: PropTypes.func,
  onMouseLeaveHandler: PropTypes.func
};
