import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  
  function transition(newView, replace = false) {
    //Transitions the current mode with the new View when called
    setMode(newView);
    //History function to maintain the state history of the component
    setHistory((prev) => {
      //replace the latest history view with the newView
      if (replace) {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = newView;
        return newHistory;
      }
      //Otherwise return all the previous views, with the new view appended
      return [...prev, newView];
    });
  }

  function back() {
    setHistory((prev) => {
      //If there is only one item in the history, return
      if (prev.length === 1) {
        return;
      }
      //Otherwise set mode to the item prior in the history array
      const newHistory = [...prev];
      newHistory.pop();
      setMode(newHistory.slice(-1)[0]);
      return newHistory;
    });
  }

  return { mode, transition, back };
}
