import autoIncrementPlugin from "../src";

describe("Working", () => {
  it("should return success message", () => {
    expect(autoIncrementPlugin({}, {})).toBe("test success");
  });
});
