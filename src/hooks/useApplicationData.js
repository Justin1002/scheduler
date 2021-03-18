import React, { useState, useEffect } from "react";
import axios from "axios";
export default function useApplicationData() {

   const [state,setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  
  function setDay(day) { 
    setState({...state, day}) 
  }

  useEffect(() => {

    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  },[])
  
  function bookInterview(id, interview) {

    console.log(id,interview)

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
 
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    setState({...state,appointments})

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(res => {
        setState({...state,appointments});
      })
    
  }

  function cancelInterview(id) {
    console.log(id)
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => {
        setState({...state,appointment})
      })
    
  }
  
  return { state , setDay, bookInterview, cancelInterview }

}