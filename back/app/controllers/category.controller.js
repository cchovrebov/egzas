const db = require("../models");
const Category = db.category;

// Create and Save a new Category
exports.create = async (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  try {
    const category = new Category({
      title: req.body.title,
    });
    const response = await category.save(category);
    return res.send(response);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Category."
    });
  }
};

// Retrieve all Category from the database.
exports.findAll = async (req, res) => {
  try {
    const response = await Category.find();
    return res.send(response);
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving categories."
    });
  }
};

// Find a single Category with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await Category.findById(id);
    if (!response) {
      return res.status(404).send({ message: `Not found Category with id=${id}` });
    }
    return res.send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Error retrieving Category with id=${id}` });
  }
};

// Update a Category by the id in the request
exports.update = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  try {
    const id = req.params.id;
    const response = await Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
    if (!response) {
      return res.status(404).send({
        message: `Cannot update Category with id=${id}. Maybe Category was not found!`
      });
    }
    return res.send({ message: "Category was updated successfully." });
  } catch (error) {
    return res.status(500).send({
      message: `Error updating Category with id=${id}`
    });
  }
};

// Delete a Category with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await Category.findByIdAndRemove(id, { useFindAndModify: false });
    if (!response) {
      return res.status(404).send({
        message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
      });
    }
    return res.send({
      message: "Category was deleted successfully!"
    });
  } catch (error) {
    return res.status(500).send({
      message: `Could not delete Category with id=${id}`
    });
  }
};