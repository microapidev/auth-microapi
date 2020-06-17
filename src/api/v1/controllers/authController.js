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

const comparePassword = async (password, hashed) => {
  const isValid = await bcrypt.compare(password, hashed);
  return isValid;
};

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
  loginOrg: async (req, res, next) => {
    // check if organization exists
    let organization;
    try {
      // console.log(`req.body signIn: ${JSON.stringify(req.body)}`);
      const sql = `
        SELECT * from organizations 
        WHERE email = $1
      `;

      const values = [req.body.email];
      const rows = await db.query(sql, values);
      organization = rows[0];
    } catch (error) {
      // if organization not exist return login error
      if (error.message.indexOf("not found") >= 0) {
        return next(
          new CustomError(401, "Invalid organization email or password")
        );
      }

      debug(error.message);
      return next(error);
    }

    // organization exists compare password
    try {
      let passwordOk;
      try {
        passwordOk = await comparePassword(
          req.body.password,
          organization.password
        );
      } catch (error) {
        return next(
          new CustomError(401, "Invalid organization email or password")
        );
      }

      if (passwordOk) {
        // return token, orgId and message
        const token = generateToken(organization);

        return handleResponse(res, 200, {
          organizationId: organization.organization_id,
          organizationName: organization.organization_name,
          message: "Login successful",
          token,
        });
      }

      return next(
        new CustomError(401, "Invalid organization email or password")
      );
    } catch (error) {
      console.log(error.message);
      return next(error);
    }
  },
};

exports.logoutOrg = (req, res, next) {
  //check for a session
  if(req.session) {
    //if found, destroy it
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } 
      else {
        //return to index
        return res.redirect('/');
      }
    });
  }
};

export default authCtrl;
