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
        <DisplayHeader render={render} renderName="propLocation" classes="" />
        <DisplayText render={render} renderName="propDescription" classes="" />
        <DisplayText render={render} renderName="propHealth" classes="" />
        <DisplayText render={render} renderName="propInventory" classes="" />
      </div>
    );
  }
}
