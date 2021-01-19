import winston = require("winston");
import { TransformableInfo} from "logform";
import CallSite = NodeJS.CallSite;
import 'winston-daily-rotate-file';

const getCallerPosition = (stack: CallSite[]) => {
    let commonStackEnd = 0;
    for (let i = 0; i < stack.length; i++) {
        // some fileNames are `null`
        const fileName = stack[i].getFileName() || "";

        if (fileName.indexOf("winston/create-logger.js") > 0) {
            commonStackEnd = i;
        }
    }
    return commonStackEnd + 1;
};

const ROOT_FOLDER = 'cmd/';
const getFileNameFromCallSite = (callSite: CallSite) => {
    let filename = callSite.getFileName();
    if (!filename) {
        return "empty";
    }

    const rootFolderPosition = filename.indexOf(ROOT_FOLDER);
    if (rootFolderPosition >= 0) {
        filename = filename.slice(rootFolderPosition + ROOT_FOLDER.length);
    }
    const functionName = callSite.getFunctionName();
    const lineNumber = callSite.getLineNumber();
    // for (let a in callSite) {
    //     "../../(a);
    // }
    // console.log(callSite.getFileName, callSite.getLineNumber, callSite.getFunction, callSite.getFunctionName, callSite.getCaller, callSite.getCallerName);

    return `${filename}:${lineNumber}|${functionName}`;
};

const getFileNameAndLineNumber = () => {
    const oldStackTrace = Error.prepareStackTrace;
    const oldLimit = Error.stackTraceLimit;
    try {
        // eslint-disable-next-line handle-callback-err
        Error.stackTraceLimit = Infinity;
        Error.prepareStackTrace = (err, structuredStackTrace) =>
            structuredStackTrace;
        const a: { stack?: CallSite[] } = {};
        Error.captureStackTrace(a);
        // in this example I needed to "peel" the first 10 CallSites in order to get to the caller we're looking for, hence the magic number 11
        // in your code, the number of stacks depends on the levels of abstractions you're using, which mainly depends on winston version!
        // so I advise you to put a breakpoint here and see if you need to adjust the number!
        // console.log(a.stack.map(b => !b
        //   ? 'null'
        //   : b.getFileName() + ':' + b.getLineNumber())
        // );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const callerPosition = getCallerPosition(a.stack!);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const output = getFileNameFromCallSite(a.stack![callerPosition]);
        Error.stackTraceLimit = oldLimit;
        Error.prepareStackTrace = oldStackTrace;
        return output;
    } finally {
        Error.prepareStackTrace = oldStackTrace;
    }
};

const logFormat = winston.format.printf((info: TransformableInfo) => {
    return `[${info.timestamp}][${info.level}] ${info.message}`;
});

const getDailyRotateTransport = (comp: string) => {
    return new winston.transports.DailyRotateFile({
        dirname: process.env.LOG_PATH || "./runtime/logs",
        filename: comp ? `%DATE%_${comp}.log` : "%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "20m"
    });
};

const consoleTransport = new winston.transports.Console({
    level: "debug",
    silent: false,
    format: winston.format.combine(winston.format.colorize(), logFormat)
});

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    transports: [getDailyRotateTransport(""), consoleTransport]
});

export default logger;