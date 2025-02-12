import JwtAuth from "./services/auth/JwtAuth";
import Cache from "./services/Cache";
import { Log, type LogConfig } from "./helpers/Log";
import I18n, { type I18nConfig } from "./services/I18n";
import FileUploader, { type FileUploaderConfig } from "./helpers/FileUploader";
import ThumbnailGenerator from "./helpers/ThumbnailGenerator";
import type { AuthConfig } from "./services/auth/Auth";

export type AmoLightConfig = {
  auth: AuthConfig;
  log: LogConfig;
  i18n: I18nConfig;
  fileUploader: FileUploaderConfig;
};

export default class AmoLight {
  static jwtAuth: typeof JwtAuth;
  static cache: typeof Cache;
  static log: typeof Log;
  static i18n: typeof I18n;
  static t: (typeof I18n)["t"];
  static fileUploader: typeof FileUploader;
  static thumbnailGenerator: typeof ThumbnailGenerator;

  static init(config: AmoLightConfig) {
    JwtAuth.init(config.auth.guards);
    Cache.init();
    Log.init(config.log);
    I18n.init(config.i18n);
    FileUploader.init(config.fileUploader);

    this.jwtAuth = JwtAuth;
    this.cache = Cache;
    this.log = Log;
    this.i18n = I18n;
    this.t = I18n.t;
    this.fileUploader = FileUploader;
    this.thumbnailGenerator = ThumbnailGenerator;
  }
}
