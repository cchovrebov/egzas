const express = require("express");
const {
  isSignedInMiddleware,
  isAdminInMiddleware,
} = require('../moddleware/moddleware')

const app = express();

module.exports = app => {
  const category = require("../controllers/category.controller.js");

  const router = require("express").Router();

  // Retrieve all categories
  router.get("/", isSignedInMiddleware, category.findAll);

  // Update a category with id
  router.put("/:id", isAdminInMiddleware, category.update);

  // Delete a category with id
  router.delete("/:id", isAdminInMiddleware, category.delete);

  // Create a new category
  router.post("/", isAdminInMiddleware, category.create);

  app.use("/api/category", router);
};
