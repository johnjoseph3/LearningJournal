import winston from "winston"

class LoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
      ]
    })
  }

  logInfo(message: string) {
    this.logger.info(message)
  }

  logError(message: string) {
    this.logger.error(message)
  }
}

export const loggerService = new LoggerService()
