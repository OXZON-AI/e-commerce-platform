import express from "express";
import { updateUser } from "../../controllers/user.controller.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyUser } from "../../middleware/verifyUser.middleware.js";

const route = express.Router();

route.put("/:id", verifyToken, verifyUser, updateUser);

export default route;
