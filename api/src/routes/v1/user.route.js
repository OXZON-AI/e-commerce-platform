import express from "express";
import {
  deleteUser,
  getUsers,
  updateUser,
} from "../../controllers/user.controller.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyUser } from "../../middleware/verifyUser.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";

const route = express.Router();

route.get("/", verifyToken, verifyAdmin, getUsers);
route.put("/:id", verifyToken, verifyUser, updateUser);
route.delete("/:id", verifyToken, deleteUser);

export default route;
