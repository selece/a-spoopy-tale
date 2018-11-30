import React from 'react';
import { observer } from 'mobx-react';

import './DisplayHeader.scss';

export default
@observer
class DisplayHeader extends React.Component {
  render() {
    const { render, renderName } = this.props;
    const display = render[renderName];

    return (
      <div>
        <h1>{display}</h1>
      </div>
    );
  }
}
