module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      user: String,
      post: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Post = mongoose.model("like", schema);
  return Post;
};
