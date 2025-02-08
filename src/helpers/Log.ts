import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

export type LogConfig = {
  debug?: boolean;
  saveDir: string;
};

export class Log {
  private static config: LogConfig;
  private static instance: winston.Logger;

  static init(config: LogConfig) {
    this.config = config;
    if (!this.instance) {
      const transport = new winston.transports.DailyRotateFile({
        filename: path.join(this.config.saveDir, "%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "90d",
      });

      this.instance = winston.createLogger({
        format: winston.format.combine(
          winston.format.json(),
          winston.format.align(),
          winston.format.prettyPrint(),
        ),
        transports: [transport],
      });

      if (this.config.debug) {
        this.instance.add(
          new winston.transports.Console({
            format: winston.format.simple(),
          }),
        );
      }
    }
  }

  static error(message: string) {
    this.instance.error(message);
  }

  static info(message: string) {
    this.instance.info(message);
  }

  static warn(message: string) {
    this.instance.warn(message);
  }
}
