import AmoLight from "../../../src/AmoLight.ts";
import type { Context } from "hono";

export default class HomeController extends AmoLight {
  static index = async (c: Context) => {
    //check cache
    await this.cache.set("random", Math.random());
    const random = await this.cache.get("random");

    //check logger
    this.log.info(`Info: ${random}`);
    this.log.error(`Error: ${random}`);

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
