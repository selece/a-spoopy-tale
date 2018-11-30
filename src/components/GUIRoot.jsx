import React from 'react';
import { observer } from 'mobx-react';

import PlayerInfo from './PlayerInfo/PlayerInfo';
import ButtonGrid from './ButtonGrid/ButtonGrid';

import './GUIRoot.scss';

export default
@observer
class GUIRoot extends React.Component {
  render() {
    const { GUIState } = this.props;

    return (
      <div id="GUIRoot" className="center">
        <PlayerInfo render={GUIState} />

        <ButtonGrid
          render={GUIState}
          renderName="propButtonGridActions"
          classes="button-grid"
        />
        <hr />
        <ButtonGrid
          render={GUIState}
          renderName="propButtonGridExits"
          classes="button-grid"
        />
      </div>
    );
  }
}
