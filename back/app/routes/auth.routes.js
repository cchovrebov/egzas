module.exports = app => {
  const auth = require("../controllers/auth.controller.js");

  const router = require("express").Router();
  router.post("/sign-in", auth.signIn);
  router.post("/validate", auth.validate);

  app.use("/api/auth", router);
};
