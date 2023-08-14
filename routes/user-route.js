import express from "express";
import {
  GetUsers,
  Register,
  Login,
  Logout,
} from "../controllers/user-controller.js";
import { verifyToken } from "../middleware/verifikasi-token.js";
import { RefreshToken } from "../controllers/refresh-token.js";

const route = express.Router();


route.post("/register", Register);
route.post("/login", Login);

route.get("/users", verifyToken, GetUsers);
route.get("/token", RefreshToken);
route.delete("/logout", Logout);

export default route;
