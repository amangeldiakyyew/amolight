import { decode, sign, verify } from "hono/jwt";
import { v4 as uuidV4 } from "uuid";
import Cache from "../Cache";
import Auth, { type AuthConfig } from "./Auth";
import type { Context } from "hono";

export type JwtAuthPayload = {
  jti: string;
  id: string;
  exp: number;
};

export default class JwtAuth extends Auth {
  private static guards: AuthConfig["guards"];

  static init(guards: AuthConfig["guards"]) {
    JwtAuth.guards = guards;
  }

  static sign = async (
    guardName: AuthConfig["guards"][number]["name"],
    {
      id,
      ...others
    }: {
      id: number | string;
      [key: string]: number | string;
    },
  ): Promise<string> => {
    const guard = JwtAuth.getGuard(guardName);
    const payload = {
      jti: uuidV4(),
      id,
      exp: Math.floor(Date.now() / 1000) + guard.expiration,
      ...others,
    };

    const result = await sign(payload, guard.secret);

    if (result) {
      return result;
    }

    return "";
  };

  private static getGuard(
    guardName: AuthConfig["guards"][number]["name"],
  ): AuthConfig["guards"][number] {
    const guard = JwtAuth.guards.find((guard) => guard.name === guardName);
    if (!guard) {
      throw new Error(`Guard ${guardName} not found`);
    }
    return guard;
  }

  verify = async (
    guardName: AuthConfig["guards"][number]["name"],
    token: string,
  ): Promise<JwtAuthPayload | false> => {
    const guard = JwtAuth.getGuard(guardName);
    try {
      const result = (await verify(token, guard.secret)) as JwtAuthPayload;

      if (typeof result === "object" && result.jti) {
        const jwtLabelRes: string | null = await Cache.get(
          `jwt_label_${guard.name}:${result.jti}`,
        );

        if (jwtLabelRes) {
          return result;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  destroy = async (
    guardName: AuthConfig["guards"][number]["name"],
    jti: string,
  ): Promise<boolean> => {
    const guard = JwtAuth.getGuard(guardName);
    return await Cache.del(`jwt_label_${guard.name}:${jti}`);
  };

  decode = async (token: string): Promise<JwtAuthPayload | false> => {
    try {
      const decoded = await decode(token);
      if (decoded && typeof decoded === "object") {
        return decoded.payload as JwtAuthPayload;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  getBearerToken = (c: Context): string | null => {
    const authHeader =
      c.req.header("Authorization") || c.req.header("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return null;
  };
}
