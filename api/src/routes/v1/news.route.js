import express from "express";
import {
  getNews,
  publish,
  subscribe,
  unsubscribe,
} from "../../controllers/news.controller.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";

const route = express.Router();

route.post("/subscribe", subscribe);
route.post("/publish", publish);
route.post("/unsubscribe", unsubscribe);
route.get("/", verifyToken, verifyAdmin, getNews);

export default route;
