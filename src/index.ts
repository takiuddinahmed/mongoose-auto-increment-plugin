import { Collection, Schema } from "mongoose";
import { autoIncrementKey } from "./option.constant";

const defaultInitialValue = 0;
const defaultStep = 1;

export default function (schema: Schema) {
  const pathsWithOptions = getAutoIncrementPathsWithOptions(schema);
  schema.pre("save", async function (this, next) {
    for (const pathWithOption of pathsWithOptions) {
      const value = await getValue(this.collection, pathWithOption);
      this[pathWithOption.path] = value;
    }
    next();
  });
}

export function getAutoIncrementPathsWithOptions(schema: Schema) {
  const paths = Object.entries(schema.paths)
    .filter(([path, schemaType]) => {
      if (
        schemaType.options[autoIncrementKey] &&
        schemaType.options.type === Number
      )
        return true;
      return false;
    })
    .map(([path, schemaType]) => {
      const pathWithOption: PathWithOption = {
        path,
        initialValue: defaultInitialValue,
        step: defaultStep,
      };
      if (schemaType.options["initialValue"]) {
        if (typeof schemaType.options["initialValue"] === "number") {
          pathWithOption.initialValue = schemaType.options["initialValue"];
        }
      }
      if (schemaType.options["step"]) {
        if (typeof schemaType.options["step"] === "number") {
          pathWithOption.step = schemaType.options["step"];
        }
      }
      return pathWithOption;
    });
  return paths;
}

async function getValue(
  collection: Collection,
  pathWithOption: PathWithOption
) {
  const doc = await collection
    .find()
    .sort({ [pathWithOption.path]: -1 })
    .limit(1)
    .toArray();
  if (doc.length) {
    const prevMaxValue = doc[0][pathWithOption.path];
    if (prevMaxValue !== undefined) {
      return prevMaxValue + pathWithOption.step;
    }
  }
  return pathWithOption.initialValue;
}
