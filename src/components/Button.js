import React from "react";

import "components/Button.scss";
const classNames = require("classnames");

export default function Button(props) {
  //establish the given button class based on props
  const buttonClass = classNames({
    button: true,
    "button--confirm": props.confirm,
    "button--danger": props.danger,
  });

  return (
    <button
      className={buttonClass}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
