const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true,
        unique: true,
      },
      email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
        unique: true,
      },
      role: String,
      image: String,
      password: String,
    },
    { timestamps: true }
  );

  schema.plugin(uniqueValidator, { message: 'is already taken.' });

  schema.method("toJSON", function () {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.pre('save', async function (next) {
    try {
      // check method of registration
      const user = this;
      if (!user.isModified('password')) next();
      const hashedPassword = bcrypt.hashSync(this.password, 10);;

      // replace plain text password with hashed password
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });

  const User = mongoose.model("user", schema);
  return User;
};

