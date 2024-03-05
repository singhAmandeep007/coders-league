const express = require("express");
const passport = require("passport");

const router = express.Router();

const { signInSocial } = require("./../controllers/authController");

require("./../services/passport");

// /auth/google

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
// /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  signInSocial
);

module.exports = router;
