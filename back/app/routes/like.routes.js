const {
  isSignedInMiddleware,
} = require('../moddleware/moddleware')

module.exports = app => {
  const like = require("../controllers/like.controller.js");

  const router = require("express").Router();

  // Create a new likes
  router.post("/", isSignedInMiddleware, like.create);

  // Retrieve all likes
  router.get("/", isSignedInMiddleware, like.findAll);

  // Create a new likes
  router.delete("/:id", isSignedInMiddleware, like.delete);

  app.use("/api/like", router);
};
