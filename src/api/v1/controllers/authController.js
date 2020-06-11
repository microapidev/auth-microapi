import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import handleResponse from "../../utils/responseHandler";
import CustomError from "../../utils/customError";
import db from "../../db";
const debug = require("debug")("log");

export const generateToken = (orgData) => {
  const { organization_id: organizationId, email } = orgData;
  const secretPhrase = Buffer.from(process.env.JWT_SECRET, "base64");
  const token = jwt.sign({ organizationId, email }, secretPhrase, {
    expiresIn: "14d",
  });

  return token;
};

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

/**
const comparePassword = async (password, hashed) => {
  const isValid = await bcrypt.compare(password, hashed);
  return isValid;
};
*/

const registerOrg = async (orgData) => {
  let hashedPassword = "";

  try {
    hashedPassword = await hashPassword(orgData.password);
  } catch (error) {
    console.log(`error hashing password: ${error.message}`);
    throw error;
  }

  // create new organization using req params
  const sql = `
    INSERT INTO organizations (organization_name, organization_key, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    orgData.organizationName,
    orgData.organizationKey,
    orgData.email,
    hashedPassword,
  ];

  let organization;
  try {
    const rows = await db.query(sql, values);
    organization = rows[0];
  } catch (error) {
    debug("An error occured inserting new organization");
    debug(error.message);
    throw error;
  }

  organization.token = generateToken(organization);

  return organization;
};

const authCtrl = {
  createOrg: async (req, res, next) => {
    try {
      // console.log(`req.body create-organization: ${JSON.stringify(req.body)}`);
      const organization = await registerOrg(req.body);

      return handleResponse(res, 201, {
        message: "Organization account succesfully created",
        organizationId: organization.organization_id,
        token: organization.token,
      });
    } catch (error) {
      console.log(`error creating organization: ${error.message}`);
      if (error.message.indexOf("duplicate key") >= 0) {
        return next(
          new CustomError(409, "Duplicate error: organization already exists")
        );
      }

      return next(error);
    }
  },
};

export default authCtrl;
