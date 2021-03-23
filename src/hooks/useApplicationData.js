import { useReducer, useEffect } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  UPDATE_SPOTS,
} from "reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;

      dispatch({
        type: SET_APPLICATION_DATA,
        days,
        appointments,
        interviewers,
      });
    });
  }, []);

  const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  useEffect(() => {
    webSocket.onopen = () => {
      webSocket.send("ping");
    };

    webSocket.onmessage = function (event) {
      const appointmentData = JSON.parse(event.data);

      if (appointmentData.type === "SET_INTERVIEW") {
        const id = appointmentData.id;
        const interview = appointmentData.interview;

        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null,
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };

        dispatch({ type: SET_INTERVIEW, appointments });
        dispatch({ type: UPDATE_SPOTS });
      }
    };

    return () => {
      webSocket.close();
    };
  }, [webSocket, state.appointments]);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, appointments });

        return res;
      })
      .then((res) => {
        dispatch({ type: UPDATE_SPOTS });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`/api/appointments/${id}`)
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, appointments });
        // setState(prev => ({...prev,appointments}));
        return res;
      })
      .then((res) => {
        dispatch({ type: UPDATE_SPOTS });
        // setState(prev => ({...prev, days:spotsRemaining(prev)}));
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
