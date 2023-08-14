import express from "express";
import database from "./config/database.js";
import route from "./routes/user-route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();

app.use(cookieParser());

app.use(express.json());
app.use(route);

const ConnectionDB = async () => {
  try {
    await database.authenticate();
    console.log("database connected.");
  } catch (e) {
    console.log(e);
  }
};

app.listen(3200, () => {
  ConnectionDB();
  console.log("listening on port 3200");
});
