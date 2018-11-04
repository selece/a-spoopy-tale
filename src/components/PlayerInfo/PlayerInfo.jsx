import React from "react";
import { observer } from "mobx-react";

import DisplayHeader from "../Display/DisplayHeader/DisplayHeader.jsx";
import DisplayText from "../Display/DisplayText/DisplayText.jsx";

import "./PlayerInfo.scss";

@observer
export default class PlayerInfo extends React.Component {
  render() {
    return (
      <div>
        <DisplayHeader
          render={this.props.render}
          renderName="propLocation"
          classes=""
        />

        <DisplayText
          render={this.props.render}
          renderName="propDescription"
          classes=""
        />

        <DisplayText
          render={this.props.render}
          renderName="propHealth"
          classes=""
        />

        <DisplayText
          render={this.props.render}
          renderName="propInventory"
          classes=""
        />
      </div>
    );
  }
}
