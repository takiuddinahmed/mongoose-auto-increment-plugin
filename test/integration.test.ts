import autoIncrementPlugin from "../src";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Model, Schema, model } from "mongoose";

const modelName = "inquiry";

describe("Integration test", () => {
  let mongod: MongoMemoryServer | undefined;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  afterEach(async () => {
    mongoose.connection.deleteModel(modelName);
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongod?.stop();
  });

  it("Should auto increment ticketNo value", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: { type: Number, autoIncrement: true },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBe(0);
    expect(logoutError.ticketNo).toBe(1);
    expect(accessError.ticketNo).toBe(2);
  }, 30000);
  it("Should auto increment with initial value", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: { type: Number, autoIncrement: true, initialValue: 1111 },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBe(1111);
    expect(logoutError.ticketNo).toBe(1112);
    expect(accessError.ticketNo).toBe(1113);
  }, 30000);
  it("Should auto increment with manual step value", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: { type: Number, autoIncrement: true, step: 5 },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBe(0);
    expect(logoutError.ticketNo).toBe(5);
    expect(accessError.ticketNo).toBe(10);
  }, 30000);
  it("Should auto increment with both initial value and manual step", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: {
        type: Number,
        autoIncrement: true,
        initialValue: 2000,
        step: 10,
      },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBe(2000);
    expect(logoutError.ticketNo).toBe(2010);
    expect(accessError.ticketNo).toBe(2020);
  }, 30000);
  it("Multiple auto increment where one  initial value and manual step and another default ", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: {
        type: Number,
        autoIncrement: true,
        initialValue: 2000,
        step: 10,
      },
      inquiryNo: {
        type: Number,
        autoIncrement: true,
      },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBe(2000);
    expect(loginError.inquiryNo).toBe(0);
    expect(logoutError.ticketNo).toBe(2010);
    expect(logoutError.inquiryNo).toBe(1);
    expect(accessError.ticketNo).toBe(2020);
    expect(accessError.inquiryNo).toBe(2);
  }, 30000);

  it("Multiple auto increment where both  initial value and manual step ", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: {
        type: Number,
        autoIncrement: true,
        initialValue: 2000,
        step: 10,
      },
      inquiryNo: {
        type: Number,
        autoIncrement: true,
        initialValue: 10,
        step: 2,
      },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBe(2000);
    expect(loginError.inquiryNo).toBe(10);
    expect(logoutError.ticketNo).toBe(2010);
    expect(logoutError.inquiryNo).toBe(12);
    expect(accessError.ticketNo).toBe(2020);
    expect(accessError.inquiryNo).toBe(14);
  }, 30000);

  it("should not change after update ", async () => {
    const InquirySchema = new Schema({
      title: String,
      inquiryNo: {
        type: Number,
        autoIncrement: true,
      },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    await loginError.updateOne({ title: "login error updated" });
    await InquiryModel.findByIdAndUpdate(logoutError._id.toString(), {
      title: "logout error updated",
    });
    await InquiryModel.updateOne(
      { _id: accessError._id.toString() },
      { title: "access error updated" }
    );

    const newLoginError = await InquiryModel.findById(
      loginError._id.toString()
    );
    const newLogoutError = await InquiryModel.findById(
      logoutError._id.toString()
    );
    const newAccessError = await InquiryModel.findById(
      accessError._id.toString()
    );
    expect(newLoginError?.inquiryNo).toBe(0);
    expect(newLogoutError?.inquiryNo).toBe(1);
    expect(newAccessError?.inquiryNo).toBe(2);
  }, 30000);

  it("Should not auto increment due to typing", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: {
        type: String,
        autoIncrement: true,
      },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBeFalsy();
    expect(logoutError.ticketNo).toBeFalsy();
    expect(accessError.ticketNo).toBeFalsy();
  }, 30000);
  it("Should not auto increment due to auto increment option false", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: {
        type: Number,
        autoIncrement: false,
        initialValue: 2000,
        step: 10,
      },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBeFalsy();
    expect(logoutError.ticketNo).toBeFalsy();
    expect(accessError.ticketNo).toBeFalsy();
  }, 30000);
  it("Should not auto increment", async () => {
    const InquirySchema = new Schema({
      title: String,
      ticketNo: {
        type: Number,
      },
    });

    InquirySchema.plugin(autoIncrementPlugin);

    const InquiryModel = mongoose.model("inquiry", InquirySchema, "inquiry");

    await InquiryModel.deleteMany({});

    const loginError = await InquiryModel.create({ title: "login error" });
    const logoutError = await InquiryModel.create({ title: "logout error" });
    const accessError = await InquiryModel.create({ title: "access error" });

    expect(loginError.ticketNo).toBeFalsy();
    expect(logoutError.ticketNo).toBeFalsy();
    expect(accessError.ticketNo).toBeFalsy();
  }, 30000);
});
