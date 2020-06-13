import express from "express";
import authRouter from "../routes/auth";
import { swaggerSpec } from "../../utils/swaggerSpec";
import responseHandler from "../../utils/responseHandler";

const router = express.Router();

// route for documentation in json
router.get("/documentation", (req, res) => {
  res.status(200).json(swaggerSpec);
});

// route for configuration
router.get("/configuration", (req, res) => {
  responseHandler(res, 200, {
    message: "configuration received",
  });
});

router.use("/auth", authRouter);

export default router;
