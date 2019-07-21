import React from 'react';
import { observer } from 'mobx-react';

import DisplayHeader from '../Display/DisplayHeader/DisplayHeader';
import DisplayText from '../Display/DisplayText/DisplayText';

import './PlayerInfo.scss';

export default
@observer
class PlayerInfo extends React.Component {
  render() {
    const { render } = this.props;

    return (
      <div>
        <DisplayHeader render={render} renderName="propLocation" />
        <DisplayText render={render} renderName="propDescription" />
        <DisplayText render={render} renderName="propHealth" />
        <DisplayText render={render} renderName="propInventory" />
      </div>
    );
  }
}
