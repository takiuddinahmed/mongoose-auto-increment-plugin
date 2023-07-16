# Mongoose Auto Increment

The Mongoose Auto Increment Plugin is a powerful tool that simplifies the generation of auto-incrementing IDs or numbers in MongoDB using Mongoose. This plugin integrates with Mongoose, allowing you to easily enhance your schemas with automatic ID or number generation capabilities.

## Installation

```
npm install --save mongoose-auto-increment-plugin
```

or

```
yarn add mongoose-auto-increment-plugin
```

## Usage

To use the "mongoose-auto-increment" library in your project, follow these steps:

Import the plugin into your file:

```javascript
const mongooseAutoIncrementPlugin = require("mongoose-auto-increment-plugin");
```

or

```javascript
import mongooseAutoIncrementPlugin from "mongoose-auto-increment-plugin";
```

Add `autoIncrement` option value true in the field which should be auto incremented.

Type of the field should be `Number`.

```javascript
const DemoSchema = new mongoose.Schema({
  customId: { type: Number, autoIncrement: true },
});
```

Default initial value is 0 and incremental step is 1. It can be overwrite by setting `initialValue` and `step` option.

```javascript
const DemoSchema = new mongoose.Schema({
  anotherId: {
    type: Number,
    autoIncrement: true,
    initialValue: 10000,
    step: 10,
  },
});
```

Add plugin in the schema

```javascript
DemoSchema.plugin(mongooseAutoIncrementPlugin);
```

## Example

```javascript
const mongoose = require("mongoose");
const mongooseAutoIncrementPlugin = require("mongoose-auto-increment-plugin");

const DemoSchema = new mongoose.Schema({
  customId: { type: Number, autoIncrement: true },
  anotherId: {
    type: Number,
    autoIncrement: true,
    initialValue: 10000,
    step: 10,
  },
});

DemoSchema.plugin(mongooseAutoIncrementPlugin);
```
