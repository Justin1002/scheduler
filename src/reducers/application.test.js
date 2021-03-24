import reducer from "reducers/application";
//Add a test if reducer does not receive an applicable argument for the switch statement
describe("Application reducer", () => {
  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});
