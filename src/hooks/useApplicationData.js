import { useState, useEffect } from "react";
import axios from "axios";
import {getAppointmentsForDay} from "../helpers/selectors.js";

export default function useApplicationData() {

  const [state,setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  // console.log(state)
  function spotsRemaining(currentState) { 
    let currentDay = {}
    let dayCopy = currentState.day
    let daysCopy = currentState.days
    let appointmentsCopy = currentState.appointments
    let count = 5
    for (const dayItem of daysCopy) {
      if (currentState.day === dayItem.name) {
        currentDay = {...dayItem}
        // console.log('currentDay', currentDay)
        // console.log(currentDay.appointments)
        for (const appointmentID of currentDay.appointments) {
          // console.log(appointmentsCopy[appointmentID])
          if(appointmentsCopy[appointmentID].interview !== null) {
            count--
          }
        }
      }
    }
    currentDay.spots = count
    daysCopy[currentDay.id-1] = currentDay
    
    return daysCopy
  }

  
  // const calcSpots = function(currentState){
  
  //   const dailyAppointments = getAppointmentsForDay(currentState, currentState.day);
  //   let count = 5;
  //   for(const appointment of dailyAppointments) {
  //     if(appointment.interview){
  //       count -= 1
  //     }
  //   }
  //   const filteredDayIndex = currentState.days.filter(currentDay => currentDay.name === currentState.day)[0].id - 1
  //   console.log('filtered',filteredDayIndex)
  //   const day = {
  //     ...currentState.days[filteredDayIndex],
  //     spots: count
  //   };
  //   const days = [...currentState.days];
  //   days[filteredDayIndex] = day;
  //   return days
  // }

  function setDay(day) { 
    setState(prev => ({...prev, day})) 
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
    
    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(res => {
        setState(prev => ({...prev,appointments}));
        return res;
      })
      .then(res => {
        setState(prev => ({...prev, days:spotsRemaining(prev)}));
      })
    
  }

  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => {
        setState(prev => ({...prev,appointments}));
        return res;
      })
      .then(res => {
        setState(prev => ({...prev, days:spotsRemaining(prev)}));
      })
    
  }

  return { state , setDay, bookInterview, cancelInterview }

}