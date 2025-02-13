import express from "express";
import { handleContact } from "../../controllers/contact.controller.js";

const route = express.Router();

route.post("/", handleContact);

export default route;
