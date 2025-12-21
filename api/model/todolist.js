import mongoose from "mongoose";

const { Schema } = mongoose;

const TodoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    meta: {
      color: { type: String, default: "#00eaff" },
      archived: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

TodoSchema.index({ user: 1, createdAt: -1 });
const Todo = mongoose.model("todos", TodoSchema);

export default Todo;
