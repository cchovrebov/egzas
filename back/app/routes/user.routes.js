const {
  isAdminInMiddleware,
} = require('../moddleware/moddleware')

module.exports = app => {
  const user = require("../controllers/user.controller.js");

  const express = require("express");
  const router = express.Router();

  // Create a new User
  router.post("/", isAdminInMiddleware, user.create);

  // Retrieve all User
  router.get("/", isAdminInMiddleware, user.findAll);

  // Delete a user with id
  router.delete("/:id", isAdminInMiddleware, user.delete);

  app.use("/api/user", router);
};
