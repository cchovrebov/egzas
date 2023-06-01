const db = require("../models");
const Like = db.like;
const Post = db.post;
const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.config');
const _ = require('lodash')

// Create and Save a new Like
exports.create = async (req, res) => {
  const token = req.headers.token
  const user = jwt.verify(token, secret);
  const postId = req.body.postId;
  const like = new Like({
    post: postId,
    user: user.id
  });

  try {
    const createdLike = await like.save(like);
    const post = await Post.findById(createdLike.post)
    return res.send(post);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the like."
    });
  }
};

// Retrieve all Posts from the database.
exports.findAll = async (req, res) => {
  const token = req.headers.token
  const user = jwt.verify(token, secret);

  try {
    const likes = await Like.find({ user: user.id });
    const postIds = _.map(likes, 'post')
    const likedPosts = await Post.find({ _id: postIds });
    return res.send(likedPosts);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving likes."
    });
  }
};

// Delete a like with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.token
  const user = jwt.verify(token, secret);

  try {
    const response = await Like.deleteMany({ post: id, user: user.id });
    if (!response) {
      return res.status(404).send({
        message: `Cannot delete Like with id=${id}. Maybe Like was not found!`
      });
    }
    return res.send({
      message: "Post was deleted successfully!"
    });
  } catch (error) {
    return res.status(500).send({
      message: `Could not delete Post with id=${id}`
    });
  }
};
