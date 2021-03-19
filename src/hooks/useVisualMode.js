import { useState } from "react";

export default function useVisualMode(initial) {
  
  const[mode, setMode] = useState(initial)
  const[history, setHistory] = useState([initial])

  function transition(newView, replace = false) {
    setMode(newView)
    
    setHistory (prev => {
      if(replace) {
        const newHistory = [...prev]
        newHistory[newHistory.length-1] = newView
        return newHistory;
      }
      return [...prev,newView]
    })
  }

  function back() {

    setHistory(prev => {
      if(prev.length ===1) {
        return
      }
      const newHistory = [...prev];
      newHistory.pop()
      setMode(newHistory.slice(-1)[0]);
      return newHistory;
    })
    
  }

  return { mode, transition, back }

}