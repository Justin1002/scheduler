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
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, deletes an interview and increases the spots remaining for Monday by 1", async () => {
    //1. Render the application
    const { container } = render(<Application />);
    //2. Wait until the text Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    //3. Click the delete button on the first full appointment
    fireEvent.click(getByAltText(appointment, "Delete"));
    //4. Check that the confirmation message is shown
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    //5. Click the confirmation button on the delete view
    fireEvent.click(getByText(appointment, "Confirm"));
    //5. Check that the element with the text deleting is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    //7. Wait until the element with the add button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));
    //7. Check that daylist item with the text "Monday" has text with 2 spots remaining
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1. Render the application
    const { container } = render(<Application />);
    //2. Wait until the text Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    //3. Click the edit button on the first full appointment
    fireEvent.click(getByAltText(appointment, "Edit"));
    //4. Add a new name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    //5. Click the save button
    fireEvent.click(getByText(appointment, "Save"));
    //6. Check that the element with the text saving is dispalyed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    //7. Check that the element shows a new appointment with the name Lydia Miller-Jones
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // Check that daylist item with the text "Monday" has text with 1 spot remaining
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));

    expect(
      getByText(appointment, "Could not save appointment")
    ).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue(
      ""
    );
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    //1. Render the application
    const { container } = render(<Application />);
    //2. Wait until the text Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    //3. Click the delete button on the first full appointment
    fireEvent.click(getByAltText(appointment, "Delete"));
    //4. Check that the confirmation message is shown
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    //5. Click the confirmation button on the delete view
    fireEvent.click(getByText(appointment, "Confirm"));
    //6. Check that the element with text deleting is in place
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    //7. Check that the element with text error is shown
    await waitForElement(() => getByText(appointment, "Error"));
    //8. Check that element with text could not delete appointment is shown
    expect(
      getByText(appointment, "Could not delete appointment")
    ).toBeInTheDocument();
    //9. Check that on-close, the appointment with text Archie Cohen is still in place
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  });
});
