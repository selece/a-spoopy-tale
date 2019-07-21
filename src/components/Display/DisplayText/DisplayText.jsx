import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import './DisplayText.scss';

export default
@observer
class DisplayText extends React.Component {
  render() {
    const { render, renderName, classes } = this.props;
    const { [renderName]: display } = render;

    return <p className={classNames(classes)}>{display}</p>;
  }
}
