
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    // Attach user ID to the request object
    req.id = decoded.id;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export default isAuthenticated;
