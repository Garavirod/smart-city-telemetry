import { GlobalEnvironmentVars } from "../environment";
import { LogLevel } from "./types";


const defaultLogLevel = LogLevel.error;

const getLogLevel = () => {
  // This allows us to change the log level at any time via an environment variable.
  let environmentLogLevel: LogLevel;
  const levelVariable = GlobalEnvironmentVars.LOGGER_LEVEL;
  switch (levelVariable?.toLowerCase()) {
    case "trace":
      environmentLogLevel = LogLevel.trace;
      break;
    case "debug":
      environmentLogLevel = LogLevel.debug;
      break;
    case "info":
      environmentLogLevel = LogLevel.info;
      break;
    case "warn":
      environmentLogLevel = LogLevel.warn;
      break;
    case "error":
      environmentLogLevel = LogLevel.error;
      break;
    default:
      environmentLogLevel = defaultLogLevel;
  }
  return environmentLogLevel;
};

const log = (messages: string[], messageLevel: LogLevel) => {
  // Skip if the message level is lower than the environment's log level.
  if (messageLevel < getLogLevel()) {
    return;
  }

  // Constructing the message.
  let output = "";
  output += `[${new Date().toUTCString()}]`; // Timestamp
  output += ` - [${LogLevel[messageLevel].toUpperCase()}]`; // Log Level
  output += ` - ${messages.join(" ")}`; // The actual message

  // Outputting to the appropriate function of "Console"
  console[LogLevel[messageLevel] as keyof typeof LogLevel](output);
};


export const Logger = {
  trace:(...messages: string[]) => {
    log(messages, LogLevel.trace);
  },
  debug:(...messages: string[]) => {
    log(messages, LogLevel.debug);
  },
  info:(...messages: string[]) => {
    log(messages, LogLevel.info);
  },
  warn:(...messages: string[]) => {
    log(messages, LogLevel.warn);
  },
  error:(...messages: string[]) => {
    log(messages, LogLevel.error);
  },
}

/* export const trace = (...messages: string[]) => {
  log(messages, LogLevel.trace);
};
export const debug = (...messages: string[]) => {
  log(messages, LogLevel.debug);
};
export const info = (...messages: string[]) => {
  log(messages, LogLevel.info);
};
export const warn = (...messages: string[]) => {
  log(messages, LogLevel.warn);
};
export const error = (...messages: string[]) => {
  log(messages, LogLevel.error);
}; */