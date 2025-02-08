import { Hono } from "hono";
import HonoExtender from "../src";
import config from "./config";
import HomeController from "./http/controllers/HomeController.ts";

HonoExtender.init(config);
const app = new Hono();
app.use(HonoExtender.i18n.middleware);
app.get("/", HomeController.index);

export default app;
