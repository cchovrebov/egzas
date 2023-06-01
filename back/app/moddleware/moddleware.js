const jwt = require('jsonwebtoken');
const db = require("../models");
const Post = db.post;
const { secret } = require('../config/auth.config');

exports.isSignedInMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token
    jwt.verify(token, secret);
    return next();
  } catch (error) {
    return res.status(503).send('Forbidden')
  }
}

exports.isAdminInMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token
    const user = jwt.verify(token, secret);
    if (user.role !== 'admin') {
      return res.status(503).send('Forbidden');
    }
    return next();
  } catch (error) {
    return res.status(503).send('Forbidden')
  }
}

exports.isOwnerOrAdminEditPost = async (req, res, next) => {
  try {
    const token = req.headers.token
    const user = jwt.verify(token, secret);
    const id = req.params.id;

    const response = await Post.findById(id);
    if (user?.role == 'admin' || response?.user === user?.id) {
      return next();
    }

    return res.status(503).send('Forbidden');
  } catch (error) {
    return res.status(503).send('Forbidden')
  }
}