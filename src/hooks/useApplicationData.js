import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const UPDATE_SPOTS = "UPDATE_SPOTS";

  function reducer(state, action) {
    
    switch (action.type) {

    case SET_DAY:
      return {
        ...state,
        day: action.day
      };

    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };

    case SET_INTERVIEW: {
      return {
        ...state, appointments: action.appointments
      };
    }

    case UPDATE_SPOTS: {
      return {
        ...state, days: spotsRemaining(state)
      };
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
    }
  }

  function spotsRemaining(currentState) {
    let currentDay = {};
    let daysCopy = currentState.days;
    let appointmentsCopy = currentState.appointments;
    let count = 5;
    for (const dayItem of daysCopy) {
      if (currentState.day === dayItem.name) {
        currentDay = {...dayItem};
        for (const appointmentID of currentDay.appointments) {
          if (appointmentsCopy[appointmentID].interview !== null) {
            count--;
          }
        }
      }
    }
    currentDay.spots = count;
    daysCopy[currentDay.id - 1] = currentDay;
    
    return daysCopy;
  }

  const [state,dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  const setDay = day => dispatch({type:SET_DAY, day});

  useEffect(() => {

    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {

      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;

      dispatch({
        type:SET_APPLICATION_DATA,
        days, appointments, interviewers
      });
    });

  },[]);

  const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
  
  useEffect(() => {
      
    webSocket.onopen = () => {
      console.log("web socket opened");
      webSocket.send("ping");
    };

    webSocket.onmessage = function(event) {

      const appointmentData = JSON.parse(event.data);

      if (appointmentData.type === "SET_INTERVIEW") {
        
        const id = appointmentData.id;
        const interview = appointmentData.interview;
        
        const appointment = {
          ...state.appointments[id],
          interview: interview ? {...interview} : null
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        dispatch({type:SET_INTERVIEW, appointments});
        dispatch({type:UPDATE_SPOTS});
      }
    };

    return ()=>{
      webSocket.close();
    };
  },[webSocket,state.appointments]);
  

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    console.log('bookinterview_state',state);
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    console.log("bookInterview:",appointments);
    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(res => {
        dispatch({type: SET_INTERVIEW, appointments});
        // setState(prev => ({...prev,appointments}));
        return res;
      })
      .then(res => {
        dispatch({type: UPDATE_SPOTS});
        // setState(prev => ({...prev, days:spotsRemaining(prev)}));
      });
    
  }

  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => {
        dispatch({type: SET_INTERVIEW,appointments});
        // setState(prev => ({...prev,appointments}));
        return res;
      })
      .then(res => {
        dispatch({type: UPDATE_SPOTS});
        // setState(prev => ({...prev, days:spotsRemaining(prev)}));
      });
    
  }

  return { state , setDay, bookInterview, cancelInterview };

}