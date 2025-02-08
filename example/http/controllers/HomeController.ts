import HonoExtender from "../../../src/HonoExtender.ts";
import type { Context } from "hono";

export default class HomeController extends HonoExtender {
  static index = async (c: Context) => {
    await this.cache.set("random", Math.random());
    const random = await this.cache.get("random");
    return c.text(this.t("Hello world") + ` | random ${random}`);
  };

  static posts = async (c: Context) => {
    return c.json([
      {
        id: 1,
        title: "Hello world",
      },
    ]);
  };
}
