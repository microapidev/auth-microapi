import express from "express";
import authRouter from "../routes/auth";

const router = express.Router();

// default response to base URL
router.get("/", (req, res) => {
  res.status(200).send("Auth microservice is up and running!");
});

router.use("/auth", authRouter);

export default router;
