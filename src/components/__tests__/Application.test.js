import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  queryByText,
  getByAltText,
  getByPlaceholderText,
  getByValue,
} from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    //Render application, wait for DOM to load and get the element Monday
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    //Click on the tuesday element
    fireEvent.click(getByText("Tuesday"));
    //Expect the name Leopold Silvers to be in document
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    //Render application, wait for DOM to load and get name Archie Cohen
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //Get appointment container
    const appointments = getAllByTestId(container, "appointment");
    const appointment = getAllByTestId(container, "appointment")[0];
    // Click add on an empty appointment
    fireEvent.click(getByAltText(appointment, "Add"));
    //Enter a student name and click on an interviewer before saving the new appointment
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    //Expect the saving view to be shown
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    //Wait for the axios function to complete, and make sure the new appointment is set, reducing the number of spots to 0
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, deletes an interview and increases the spots remaining for Monday by 1", async () => {
    //Render the application
    const { container } = render(<Application />);
    //Wait until the text Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );
    //Click the delete button on the first full appointment
    fireEvent.click(getByAltText(appointment, "Delete"));
    //Check that the confirmation message is shown
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    //Click the confirmation button on the delete view
    fireEvent.click(getByText(appointment, "Confirm"));
    //Check that the element with the text deleting is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    //Wait until the element with the add button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));
    //Check that daylist item with the text "Monday" has text with 2 spots remaining
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //Render the application
    const { container } = render(<Application />);
    //Wait until the text Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    //Click the edit button on the first full appointment
    fireEvent.click(getByAltText(appointment, "Edit"));
    //Add a new name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    //Click the save button
    fireEvent.click(getByText(appointment, "Save"));
    //Check that the element with the text saving is dispalyed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    //Check that the element shows a new appointment with the name Lydia Miller-Jones
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    //Check that daylist item with the text "Monday" has text with 1 spot remaining
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    //Simulate the axios put request error
    axios.put.mockRejectedValueOnce();
    //Render the application, wait for axios GET requests to complete
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // Obtain appointment container
    const appointments = getAllByTestId(container, "appointment");
    const appointment = getAllByTestId(container, "appointment")[0];
    //Click on the add button
    fireEvent.click(getByAltText(appointment, "Add"));
    //Attempt to insert student name, click and interviewer and save 
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    //Check to see if saving view is shown
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    //Wait for axios put to fail, ensure Error message is shown
    await waitForElement(() => getByText(appointment, "Error"));
    expect(
      getByText(appointment, "Could not save appointment")
    ).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));
    //Make sure no appointment is seen
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue(
      ""
    );
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // Render the application
    const { container } = render(<Application />);
    // Wait until the text Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );
    // Click the delete button on the first full appointment
    fireEvent.click(getByAltText(appointment, "Delete"));
    // Check that the confirmation message is shown
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    // Click the confirmation button on the delete view
    fireEvent.click(getByText(appointment, "Confirm"));
    //Check that the element with text deleting is in place
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    //Check that the element with text error is shown
    await waitForElement(() => getByText(appointment, "Error"));
    //Check that element with text could not delete appointment is shown
    expect(
      getByText(appointment, "Could not delete appointment")
    ).toBeInTheDocument();
    //Check that on-close, the appointment with text Archie Cohen is still in place
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  });
});
