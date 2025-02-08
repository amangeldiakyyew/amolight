import path from "path";

export default {
  auth: {
    guards: [
      {
        name: "user",
        secret: "secret",
        expiration: 60000,
      },
      {
        name: "admin",
        secret: "secret",
        expiration: 60000,
      },
    ],
  },
  log: {
    debug: true,
    saveDir: path.join(process.cwd(), "/example/logs"),
  },
  i18n: {
    fallbackLanguage: "en",
    languages: ["en", "ru", "tk"],
    ns: "example/locales/{{lng}}.json",
    initAsync: true,
  },
  fileUploader: {
    saveDir: path.join(process.cwd(), "/public/uploads"),
    createDateFolder: true,
  },
};
