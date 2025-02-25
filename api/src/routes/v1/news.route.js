import express from "express";
import { subscribe } from "../../controllers/news.controller.js";

const route = express.Router();

route.post("/subscribe", subscribe);

export default route;
