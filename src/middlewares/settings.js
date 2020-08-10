require("dotenv").config();
const mysql = require("mysql");
const CustomResponse = require("../utils/response");
const settingsHandler = require("../utils/settingsHandler");
const getMockSettings = require("../utils/mocks/settings");
const log = require("debug")("log");

const dbConfig = {
  host: "lucid.blog",
  user: "root",
  password: "123456",
  database: "microapi",
  port: 5321,
};

//get settings from external DB or endpoint
//function might be modified to accomodate both sources
const getSettings = async (apiKey) => {
  //fool linter
  log(apiKey);

  let connection;

  function handleDisconnect() {
    // Recreate the connection, since the old one cannot be reused.
    connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
      // The server is either down or restarting (takes a while sometimes).
      if (err) {
        console.log("error when connecting to db:", err);
        // We introduce a delay before attempting to reconnect, to avoid a hot loop,
        // and to allow our node script to process asynchronous requests in the meantime.
        setTimeout(handleDisconnect, 2000);
      }
    });

    connection.on("error", (err) => {
      console.log("db error", err);
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        // Connection to the MySQL server is usually lost due to either server restart, or a
        // connnection idle timeout (the wait_timeout server variable configures this)
        handleDisconnect();
      } else {
        throw err;
      }
    });
  }

  handleDisconnect();

  // Query the database for the project belonging to the project
  connection.query("SELECT * FROM user_dashboard_project", (err, results) => {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        handleDisconnect();
      }
      console.log("Query error: ", err);
      return;
    }
    console.log(results);
  });

  //mock the request for now with mocksettings
  //settings need to come from source
  //validate the settings by matching against predefined schema
  const settings = settingsHandler.parseSettings(getMockSettings(), true);
  return settings;
};

const settingsMiddleware = async (req, res, next) => {
  /* In multi-tenant app, projectID is retreived from API key in a custom HTTP header
   ** For now we stick with multi-tenant and we will customize this to cater for **
   ** single tenancy architecture in time where projectIDs are irrelevant **
   ** In retrospect, expiry of API keys should be from MicroAPI, **
   ** so making a request for settings with an invalid API key will be rejected **
   */
  try {
    // we are calling our custom HTTP header X-MicroAPI-ProjectKey
    const apiKey = req.headers["x-microapi-projectkey"];
    if (!apiKey) {
      res
        .status(401)
        .json(
          CustomResponse(
            "UnauthorizedError",
            { statusCode: 401, message: "No API key found" },
            false
          )
        );
    }

    // get settings from parent DB/source
    const settings = await getSettings(apiKey);
    if (settings.errors) {
      res
        .status(400)
        .json(
          CustomResponse(
            "BadRequestError",
            { statusCode: 400, message: settings.errors[0].message },
            false
          )
        );
    }

    console.log(settings);

    //attach setting to request body
    req.settings = settings;
    // req.projectId = projectId;

    //pass to next middleware
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(
      CustomResponse(
        "InternalServerError",
        {
          statusCode: 500,
          message: "Something went wrong, please try again later",
        },
        false
      )
    );
  }
};

module.exports = settingsMiddleware;
