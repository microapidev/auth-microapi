const router = require("express").Router();

const googleRoutes = require("./socials/googleLogin");
const gitRoutes = require("./socials/gitauth");
const facebookRoutes = require("./socials/fbauth");
const twitterRoutes = require("./socials/twitterAuth");

router.use("/facebook", facebookRoutes);
router.use("/google", googleRoutes);
router.use("/github", gitRoutes);
router.use("/twitter", twitterRoutes);

module.exports = router;
