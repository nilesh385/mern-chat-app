import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    // Get JWT token from cookie
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ error: "Login to get the token" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("not decoded");
    }

    // Add user ID to req object
    req.user = decoded.user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid JWT token" });
  }
};

export default authUser;
