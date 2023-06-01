const db = require("../models");
const User = db.user;
const _ = require("lodash");

// Create and Save a new User
exports.create = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  // Create a User
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: 'user'
  });

  try {
    const response = await user.save(user)
    return res.send(response);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the user."
    });
  }
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
  try {
    const data = await User.find();
    const response = _.map(data, item => ({
      username: item.username,
      email: item.email,
      id: item.id,
      role: item.role,
    }));
    return res.send(response);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  }
};

// Find a single Users with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await User.findById(id);
    if (!data) {
      return res.status(404).send({ message: `Not found User with id=${id}` });
    }
    const response = _.map(data, item => ({
      username: item.username,
      email: item.email,
      id: item.id,
      role: item.role,
    }))
    return res.send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Error retrieving User with id=${id}` });
  }
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await User.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data) {
      return res.status(404).send({
        message: `Cannot delete User with id=${id}. Maybe Post was not found!`
      });
    }
    return res.send({
      message: "User was deleted successfully!"
    });
  } catch (error) {
    return res.status(500).send({
      message: `Could not delete User with id=${id}`
    });
  }
};
