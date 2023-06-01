module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      title: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Category = mongoose.model("category", schema);
  return Category;
};
