function getAppointmentsForDay(state, day) {
  //generate empty appointments array
  let appointmentsArr = [];
  //loop through each day, if the day name matches the given day, push all the appointments for that given day to the appointments array
  for (const days of state.days) {
    if (days.name === day) {
      for (const items of days.appointments) {
        appointmentsArr.push(state.appointments[items]);
      }
      return appointmentsArr;
    }
  }
  //return empty array if day name is not found
  return appointmentsArr;
}

function getInterview(state, interview) {
  //if interview exists, create new object with the student and interviewer details
  let interviewObj = {};
  if (interview) {
    interviewObj["student"] = interview.student;
    interviewObj["interviewer"] = state.interviewers[interview.interviewer];
    return interviewObj;
  }
  return null;
}

function getInterviewersForDay(state, day) {
  let interviewersArr = [];
  //show all interviewers for a given day
  for (const days of state.days) {
    if (days.name === day) {
      for (const items of days.interviewers) {
        interviewersArr.push(state.interviewers[items]);
      }
      return interviewersArr;
    }
  }
  return interviewersArr;
}

export { getAppointmentsForDay, getInterview, getInterviewersForDay };
