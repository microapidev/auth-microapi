import app from "./api";
import createDB from "./api/db/create-db";

require("custom-env").env();

const config = require("config");
const http = require("http");
const debug = require("debug")("log");

const startServer = () => {
  const server = http.createServer(app);
  const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }

    return false;
  };

  const port = normalizePort(config.get("server.port"));
  app.set("port", port);

  const errorHandler = (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const address = server.address();
    const bind =
      typeof address === "string" ? `pipe ${address}` : `port: ${port}`;
    switch (error.code) {
      case "EACCES":
        debug(`${bind} requires elevated privileges.`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        debug(`${bind} is already in use.`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  server.on("error", errorHandler);
  server.on("listening", () => {
    const address = server.address();
    const bind =
      typeof address === "string" ? `pipe ${address}` : `port ${port}`;
    debug(`Listening on ${bind}`);
  });

  server.listen(port);

  process.on("SIGINT", () => {
    debug("Bye bye!");
    process.exit();
  }); // -- for nodemon headache
};

createDB(config.get("dbConfig"))
  .then(() => {
    // debug(res);
    startServer();
  })
  .catch((error) => {
    // handle errors here
    debug(error.message);
    process.exit(-1);
  });
