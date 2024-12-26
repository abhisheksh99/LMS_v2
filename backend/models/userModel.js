import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student", "Instructor"],
      default: "Student",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    photoUrl: {
      type: String,
      default:
        "data:image/jpeg;base64,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",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;