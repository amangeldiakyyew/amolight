import JwtAuth from "./services/auth/JwtAuth.ts";
import Cache from "./services/Cache.ts";
import I18n, { type I18nConfig } from "./services/I18n.ts";
import FileUploader, {
  type FileUploaderConfig,
} from "./helpers/FileUploader.ts";
import type { AuthConfig } from "./services/auth/Auth.ts";

export type HonoExtenderConfig = {
  auth: AuthConfig;
  i18n: I18nConfig;
  fileUploader: FileUploaderConfig;
};

export default class HonoExtender {
  static jwtAuth: typeof JwtAuth;
  static cache: typeof Cache;
  static i18n: typeof I18n;
  static t: (typeof I18n)["t"];
  static fileUploader: typeof FileUploader;

  static init(config: HonoExtenderConfig) {
    JwtAuth.init(config.auth.guards);
    Cache.init();
    I18n.init(config.i18n);
    FileUploader.init(config.fileUploader);

    this.jwtAuth = JwtAuth;
    this.cache = Cache;
    this.i18n = I18n;
    this.t = I18n.t;
    this.fileUploader = FileUploader;
  }
}
