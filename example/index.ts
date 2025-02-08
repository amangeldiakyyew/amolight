import { Hono } from "hono";
import AmoLight from "../src";
import config from "./config";
import HomeController from "./http/controllers/HomeController.ts";

AmoLight.init(config);
const app = new Hono();
app.use(AmoLight.i18n.middleware);
app.get("/", HomeController.index);

export default app;
