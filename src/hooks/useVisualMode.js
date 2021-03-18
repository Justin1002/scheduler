import React, { useState } from "react";

export default function useVisualMode(initial) {
  
  const[mode, setMode] = useState(initial)
  const[history, setHistory] = useState([initial])

  function transition(newView, replace = false) {
    setMode(newView)
    if(replace) {
      history[history.length-1] = newView;
      return;
    }
    setHistory(prev => ([...prev,newView]))
    // if(!replace) {
    // setHistory(prev => ([...prev, newView]))
    // setMode(newView)
    // }
    // else {
    // history.pop()
    // setHistory(prev => ([...prev, newView]))
    // setMode(newView)
    // }
  }

  function back() {
    if (history.length > 1) {
    history.pop()
    setMode(history[history.length-1])
    }
    setMode(history[history.length-1])
  }

  return { mode, transition, back }

}