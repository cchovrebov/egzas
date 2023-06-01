const db = require("../models");
const Post = db.post;
const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.config');
const _ = require('lodash')

// Create and Save a new Post
exports.create = async (req, res) => {
  const token = req.headers.token
  const user = jwt.verify(token, secret);
  // Create a Post
  const imagesBase64 = _.map(req.body.images, 'data_url').join('[SEPARATOR]');
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    images: imagesBase64,
    published: false,
    user: user.id
  });

  try {
    const response = await post.save(post)
    return res.send(response);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Post."
    });
  }
};

// Retrieve all Posts from the database.
exports.findAll = async (req, res) => {
  try {
    const response = await Post.find({ published: false });
    return res.send(response);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving posts."
    });
  }
};

// Find a single Post with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await Post.findById(id);
    if (!response) {
      return res.status(404).send({ message: `Not found Post with id=${id}` });
    }
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: `Could not retrieve Post with id=${id}` });
  }
};

// Update a Post by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  const imagesBase64 = _.map(req.body.images, 'data_url').join('[SEPARATOR]');
  const post = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    images: imagesBase64,
    published: false
  };

  try {
    const response = await Post.findByIdAndUpdate(id, post, { useFindAndModify: false });
    if (!response) {
      return res.status(404).send({
        message: `Cannot update Post with id=${id}. Maybe Post was not found!`
      });
    }
    return res.send({ message: "Post was updated successfully." });
  } catch (error) {
    return res.status(500).send({
      message: `Could not update Post with id=${id}`
    });
  }
};

// Delete a Post with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await Post.findByIdAndRemove(id, { useFindAndModify: false });
    if (!response) {
      return res.status(404).send({
        message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
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

// Find all published Posts
exports.findAllPublished = async (req, res) => {
  try {
    const response = await Post.find({ published: true });
    return res.send(response);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving posts."
    });
  }
};


// Publish a Post by the id in the request
exports.publish = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to publish can not be empty!"
    });
  }

  const id = req.params.id;

  try {
    const response = await Post.findByIdAndUpdate(id, { published: true }, { useFindAndModify: false });
    if (!response) {
      return res.status(404).send({
        message: `Cannot publish Post with id=${id}. Maybe Post was not found!`
      });
    }
    return res.send({ message: "Post was publish successfully." });
  } catch (error) {
    return res.status(500).send({
      message: `Error updating Post with id=${id}`
    });
  }
};