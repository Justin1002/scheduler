import React from "react";
import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) { 

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE="ERROR_SAVE";
const ERROR_DELETE="ERROR_DELETE";

const { mode, transition, back } = useVisualMode(
  props.interview ? SHOW : EMPTY
);

function save(name, interviewer) {
  const interview = {
    student: name,
    interviewer
  };
  transition(SAVING)
  props.bookInterview(props.id, interview)
    .then( res => transition(SHOW))
    .catch( err => transition(ERROR_SAVE, true))
  return;
}
function confirmDeletion() {
  transition(CONFIRM)
}

function deleteInterview() {
  transition(DELETE,true)
  props.cancelInterview(props.id)
  .then( res => transition(EMPTY))
  .catch( err => transition(ERROR_DELETE,true))
  return;

}
function editInterview() {
  transition(EDIT)
}



// {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty/>}

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (<Show student={props.interview.student} interviewer={props.interview.interviewer} onDelete={confirmDeletion} onEdit={editInterview} />)}
      {mode === CREATE && (<Form name={props.name} interviewer={props.interviewer} interviewers={props.interviewers} onCancel={back} onSave={save} />)}
      {mode === SAVING && (<Status message="Saving" />)}
      {mode === DELETE && (<Status message="Deleting" />)}
      {mode === CONFIRM && (<Confirm message="Are you sure you would like to delete?" onCancel={back} onConfirm={deleteInterview} />)}
      {mode === EDIT && (<Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onCancel={back} onSave={save} />)}
      {mode === ERROR_SAVE && (<Error message="Could not save appointment" onClose={back} />)}
      {mode === ERROR_DELETE && (<Error message="Could not delete appointment" onClose={back} />)}
    </article>
  )
}