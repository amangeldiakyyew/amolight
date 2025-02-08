import { compareSync, hashSync } from "bcryptjs";

export type AuthConfig = {
  guards: {
    name: string;
    secret: string;
    expiration: number;
  }[];
};

export default class Auth {
  static hashPassword = (password: string | number): string => {
    return hashSync(`${password}`, 12);
  };

  static comparePassword = (
    password: string,
    hashedPassword: string,
  ): boolean => {
    return compareSync(password, hashedPassword);
  };
}
