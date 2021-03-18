
 function getAppointmentsForDay(state, day) {
  let appointmentsArr = []

  for (const days of state.days) {
    if (days.name === day) {
      for (const items of days.appointments) {
        appointmentsArr.push(state.appointments[items])
      }
      return appointmentsArr
    }
  }
  return appointmentsArr
}


function getInterview(state, interview) {
  let interviewObj = {}
  if(interview) {
    interviewObj["student"] = interview.student
    interviewObj["interviewer"] = state.interviewers[interview.interviewer]
    return interviewObj
  }
  return null
}

function getInterviewersForDay(state, day) {
  let interviewersArr = []

  for (const days of state.days) {
    if (days.name === day) {
      for (const items of days.interviewers) {
        interviewersArr.push(state.interviewers[items])
      }
      return interviewersArr
    }
  }
  return interviewersArr
}


export {getAppointmentsForDay, getInterview, getInterviewersForDay}