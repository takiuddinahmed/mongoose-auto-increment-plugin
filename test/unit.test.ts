import { Schema } from "mongoose";
import { getAutoIncrementPathsWithOptions } from "../src";

describe("Unit test", () => {
  describe("Option test", () => {
    it("should return valid paths", () => {
      const schema = new Schema({
        a: String,
        b: { type: Number, autoIncrement: true },
        // this is not valid
        c: { type: String, autoIncrement: true },
        d: { type: Number, autoIncrement: false },
      });

      const paths = getAutoIncrementPathsWithOptions(schema);

      expect(paths).toEqual([{ path: "b", initialValue: 0, step: 1 }]);
    });

    it("should return empty", () => {
      const schema = new Schema({
        a: String,
        b: { type: Number },
        // this is not valid
        c: { type: String },
        d: { type: Number, autoIncrement: false },
      });

      const paths = getAutoIncrementPathsWithOptions(schema);

      expect(paths).toEqual([]);
    });
    it("should contain user defined options", () => {
      const schema = new Schema({
        a: String,
        b: { type: Number },
        // this is not valid
        c: { type: String },
        d: { type: Number, autoIncrement: true, initialValue: 8888 },
        e: { type: Number, autoIncrement: true, initialValue: 8888, step: 7 },
        f: { type: Number, autoIncrement: true, step: 7 },
        g: { type: Number, autoIncrement: true, initialValue: "8888", step: 7 },
        h: {
          type: Number,
          autoIncrement: true,
          initialValue: "8888",
          step: "7",
        },
      });

      const paths = getAutoIncrementPathsWithOptions(schema);

      expect(paths).toEqual([
        { path: "d", initialValue: 8888, step: 1 },
        { path: "e", initialValue: 8888, step: 7 },
        { path: "f", initialValue: 0, step: 7 },
        { path: "g", initialValue: 0, step: 7 },
        { path: "h", initialValue: 0, step: 1 },
      ]);
    });
  });
});
