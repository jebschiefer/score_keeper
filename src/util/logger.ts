import * as winston from "winston";

export const logger = new winston.Logger({
    level: "debug",
    transports:[
        new winston.transports.Console({
            timestamp: true,
            colorize: true,
        }),
    ],
});

export const logRoute = (req, res, next) => {
    logger.info(`${req.ip}: ${req.method} ${req.path}`);
    next();
};
