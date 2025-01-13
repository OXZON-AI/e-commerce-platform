import express from "express";
import { signin, signout, signup } from "../../controllers/auth.controller.js";

const route = express.Router();

route.post("/signin", signin);
route.post("/signup", signup);
route.get("/signout", signout);

export default route;
