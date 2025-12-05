import mongoose from "mongoose";

/**
 * PostSchema defines the schema for a post in the database.
 * It includes the title and description of the post.
 */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [400, "Description cannot be more than 400 characters"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
