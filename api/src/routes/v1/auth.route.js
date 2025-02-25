import express from "express";
import {
  requestPasswordReset,
  resetPassword,
  signin,
  signout,
  signup,
} from "../../controllers/auth.controller.js";

const route = express.Router();

route.post("/signin", signin);
route.post("/signup", signup);
route.post("/request-reset", requestPasswordReset);
route.post("/reset-password", resetPassword);
route.get("/signout", signout);

export default route;
