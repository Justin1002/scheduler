import React from "react";

import "components/DayListItem.scss";
const classNames = require("classnames");

export default function DayListItem(props) {
  //Determine whether or not the specific day is selected
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0,
  });
  //Function to format text shown for spots remaining
  const formatSpots = function (spots) {
    if (spots === 0) {
      return "no spots remaining";
    }
    if (spots === 1) {
      return "1 spot remaining";
    }
    return `${spots} spots remaining`;
  };

  return (
    <li
      className={dayClass}
      selected={props.selected}
      onClick={() => props.setDay(props.name)}
      data-testid="day"
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
