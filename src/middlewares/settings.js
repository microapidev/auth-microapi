require("dotenv").config();
const CustomResponse = require("../utils/response");
const settingsHandler = require("../utils/settingsHandler");
const getMockSettings = require("../utils/mocks/settings");
const log = require("debug")("log");

//get settings from external DB or endpoint
//function might be modified to accomodate both sources
const getSettings = async (apiKey) => {
  //fool linter
  log(apiKey);

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
