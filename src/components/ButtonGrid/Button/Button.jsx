import React from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import classNames from "classnames";

import "./Button.scss";

@observer
export default class Button extends React.Component {
  render() {
    // NOTE - since this.props.classes was converted to an observable
    // we need to either access it through $mobx.values or mobx.toJS
    const classes = toJS(this.props.classes);
    return (
      <div
        className={classNames(classes)}
        onClick={this.props.onClickHandler}
        onMouseEnter={this.props.onMouseEnterHandler}
        onMouseLeave={this.props.onMouseLeaveHandler}
      >
        <p>{this.props.display}</p>
      </div>
    );
  }
}
