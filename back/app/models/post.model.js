module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean,
      price: Number,
      category: String,
      images: String,
      published: Boolean,
      user: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Post = mongoose.model("post", schema);
  return Post;
};
