require("dotenv").config();
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError";
import { parseSettings } from "../utils/settingsParser";
import { mockSettings as fetchSettings } from "../utils/mocks/settings";
const log = require("debug")("log");

export const getProjectId = (apiKey) => {
  //verify/decode projectID from API key
  const decoded = jwt.verify(
    apiKey,
    Buffer.from(process.env.API_SECRET, "base64")
  );
  return decoded.projectId;
};

//get settings from external DB or endpoint
//function might be modified to accomodate both sources
export const getSettings = async (apiKey) => {
  //fool linter
  log(apiKey);

  //mock the request for now with mocksettings
  //settings need to come from source
  //validate the settings by matching against predefined schema
  const settings = parseSettings(fetchSettings(), true);
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
    if (!apiKey) throw new CustomError(401, "No API key found");

    //validate apiKey
    let projectId;
    try {
      projectId = getProjectId(apiKey);
    } catch (error) {
      throw new CustomError(401, "Invalid API key found");
    }

    // get settings from parent DB/source
    const settings = await getSettings(apiKey);
    if (settings.errors) {
      throw new CustomError(400, "Invalid settings found", settings.errors);
    }

    //attach setting to request body
    req.settings = settings;
    req.projectId = projectId;

    //pass to next middleware
    next();
  } catch (error) {
    next(error);
  }
};

export default settingsMiddleware;
