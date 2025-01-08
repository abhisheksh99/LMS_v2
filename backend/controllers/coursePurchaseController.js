import asyncHandler from "express-async-handler";
import CoursePurchase from "../models/CoursePurchaseModel.js";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.id; // Extract user ID from authenticated request
  const { courseId } = req.body;

  // Fetch course details
  const course = await Course.findById(courseId);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }

  // Create a Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.courseTitle,
            images: [course.courseThumbnail],
          },
          unit_amount: course.coursePrice * 100, // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/course-progress/${courseId}`, // URL on successful payment
    cancel_url: `http://localhost:5173/course-detail/${courseId}`, // URL on payment cancellation
    metadata: {
      courseId,
      userId,
    },
    shipping_address_collection: {
      allowed_countries: ["US"], // Restrict to specific countries if needed
    },
  });

  if (!session.url) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create Stripe session" });
  }

  // Create a new purchase record AFTER the session is created
  await CoursePurchase.create({
    courseId,
    userId,
    paymentId: session.id, // Assign the Stripe session ID as paymentId
    amount: course.coursePrice,
    status: "PENDING",
  });

  return res.status(200).json({
    success: true,
    url: session.url, // Return the Stripe Checkout URL
  });
});

// Stripe Webhook
export const stripeWebhook = asyncHandler(async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Raw Body:", req.body);
  console.log("Signature:", req.headers["stripe-signature"]);
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_ENDPOINT_SECRET
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle events
  if (event.type === "checkout.session.completed") {
    console.log("Stripe checkout session completed.");

    try {
      const session = event.data.object;

      // Find the purchase record using the payment ID
      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        console.error("Purchase not found.");
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Update the purchase status
      purchase.status = "COMPLETED";
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100; // Convert cents to dollars
      }
      await purchase.save();

      // Unlock lectures
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      // Update user and course relationships
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId } },
        { new: true }
      );
      await Course.findByIdAndUpdate(
        purchase.courseId,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

      console.log("Purchase and enrollment processed successfully.");
    } catch (error) {
      console.error("Error processing checkout session:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  res.status(200).json({ received: true });
});

export const getCourseDetailWithPurchaseStatus = asyncHandler(
  async (req, res) => {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  }
);

export const getAllPurchasedCourse = asyncHandler(async (req, res) => {
  const purchasedCourse = await CoursePurchase.find({
    status: { $regex: "COMPLETED", $options: "i" }, 
  }).populate("courseId");

  console.log("Found purchases:", purchasedCourse);

  if (!purchasedCourse) {
    return res.status(404).json({
      purchasedCourse: [],
    });
  }
  return res.status(200).json({
    purchasedCourse,
  });
});
