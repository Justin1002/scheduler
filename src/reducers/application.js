export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
export const UPDATE_SPOTS = "UPDATE_SPOTS";

function spotsRemaining(currentState) {
  //create copies of the state, declare variables
  let currentDay = {};
  let daysCopy = [...currentState.days];
  let appointmentsCopy = { ...currentState.appointments };
  let count;
  //loop through dayItem, and update the spots for each day
  for (const dayItem of daysCopy) {
    //establish initial available spots from day object, and establish currentDay
    count = dayItem.appointments.length;
    currentDay = { ...dayItem };
    //check which appointments currently have interview scheduled, reduce remaining spots if so
    for (const ID of currentDay.appointments) {
      if (appointmentsCopy[ID].interview !== null) {
        count--;
      }
    }
    //update currentDay with spots, update the days array at the index with the new spot count
    currentDay.spots = count;
    daysCopy[currentDay.id - 1] = currentDay;
  }
  //return the new days array copy
  return daysCopy;
}

function reducer(state, action) {
  switch (action.type) {
    //sets the current day state
    case SET_DAY:
      return {
        ...state,
        day: action.day,
      };
    //sets the initial application data from the API server
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    //Called when an interview is booked or deleted
    case SET_INTERVIEW: {
      return {
        ...state,
        appointments: action.appointments,
      };
    }
    // update spots when an interview is booked or deleted
    case UPDATE_SPOTS: {
      return {
        ...state,
        days: spotsRemaining(state),
      };
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default reducer;
