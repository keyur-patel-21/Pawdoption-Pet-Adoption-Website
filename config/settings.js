import { config } from "dotenv";

config();

export const mongoConfig = {
  // serverUrl: 'mongodb://0.0.0.0:27017',
  serverUrl: process.env.MONGO_URI,
  database: "pawdoption",
};
