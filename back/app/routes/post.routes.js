const {
  isAdminInMiddleware,
  isSignedInMiddleware,
  isOwnerOrAdminEditPost,
} = require('../moddleware/moddleware')

module.exports = app => {
  const post = require("../controllers/post.controller.js");

  const router = require("express").Router();

  // Create a new post
  router.post("/", isSignedInMiddleware, post.create);

  // Retrieve all posts
  router.get("/", isAdminInMiddleware, post.findAll);

  // Retrieve all published posts
  router.get("/published", isSignedInMiddleware, post.findAllPublished);

  // Retrieve a single post with id
  router.get("/:id", isSignedInMiddleware, post.findOne);

  // Update a post with id
  router.put("/:id", isOwnerOrAdminEditPost, post.update);

  // Delete a post with id
  router.delete("/:id", isOwnerOrAdminEditPost, post.delete);

  // Publish a category with id
  router.put("/publish/:id", isAdminInMiddleware, post.publish);

  app.use("/api/post", router);
};
