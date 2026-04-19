import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // 1. Errors විතරක් වෙනම ෆයිල් එකකට සේව් කරනවා
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        // 2. හැම දෙයක්ම එකම ෆයිල් එකකට සේව් කරනවා
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});

// Production එකේ නෙවෙයි නම් විතරක් Console එකේ ලොග් පෙන්වනවා
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

export default logger;