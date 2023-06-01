const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require("./user.model.js")(mongoose);
db.like = require("./like.model.js")(mongoose);
db.post = require("./post.model.js")(mongoose);
db.category = require("./category.model.js")(mongoose);

module.exports = db;
