import i18next from "i18next";
import FsBackend, { type FsBackendOptions } from "i18next-fs-backend";
import type { Context } from "hono";

export type I18nConfig = {
  fallbackLanguage: string;
  languages: string[];
  ns: string;
  initAsync: boolean;
};

export default class I18n {
  static t = i18next.t;
  static config: I18nConfig;
  private static instance: Promise<any> | null = null;

  static init = (config: I18nConfig) => {
    this.config = config;
    if (!I18n.instance) {
      I18n.instance = i18next.use(FsBackend).init<FsBackendOptions>(
        {
          lng: config.fallbackLanguage,
          fallbackLng: config.fallbackLanguage,
          preload: config.languages,
          backend: {
            loadPath: config.ns,
          },
          initAsync: config.initAsync,
        },
        (err: Error) => {
          if (err) return console.error(err);
        },
      );
    }
  };

  static middleware = async (c: Context, next: Function) => {
    const queryLanguage = c.req.query("language")?.toLowerCase() || "";
    const headerLanguage =
      c.req
        .header("accept-language")
        ?.split(",")[0]
        ?.split("-")[0]
        ?.toLowerCase() || "";

    let language = this.config.fallbackLanguage;
    if (this.config.languages.includes(queryLanguage)) {
      language = queryLanguage;
    } else if (this.config.languages.includes(headerLanguage)) {
      language = headerLanguage;
    }

    await i18next.changeLanguage(language);

    await next();
  };
}
