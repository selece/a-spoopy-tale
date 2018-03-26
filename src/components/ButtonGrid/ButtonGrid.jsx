import React from "react";
import { observer } from "mobx-react";
import { generate } from "shortid";

import Button from "./Button/Button.jsx";

import "./ButtonGrid.scss";

@observer
export default class ButtonGrid extends React.Component {
  render() {
    return (
      <div className={this.props.classes}>
        {this.props.render[this.props.renderName].map(btn => (
          <Button
            display={btn.display}
            onClickHandler={btn.onClickHandler}
            onMouseEnter={btn.onMouseEnterHandler}
            onMouseLeave={btn.onMouseLeaveHandler}
            key={generate()}
            classes={btn.classes}
          />
        ))}
      </div>
    );
  }
}
