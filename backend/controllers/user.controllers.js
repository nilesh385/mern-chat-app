import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const signup = async (req, res) => {
  try {
    const { fullname, profilePhoto, username, email, password } = req.body;

    if (!username || !email || !password || !fullname) {
      return res
        .status(400)
        .send({ error: "Please fill all the required fields" });
    }

    // Email validation using regular expression
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    // Check for existing user with the same username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      let error;
      if (existingUser.username === username) {
        error = "Username already exists";
      } else {
        error = "Email already exists";
      }
      return res.status(409).json({ error });
    }

    let cloudinaryUrl;
    if (profilePhoto) {
      const response = await cloudinary.uploader.upload(profilePhoto);
      cloudinaryUrl = response.secure_url;
    }
    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      profilePhoto: cloudinaryUrl,
    });

    await user.save();

    // JWT Token Generation
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ user }, jwtSecretKey, {
      expiresIn: "15d",
    }); // Token expires in 15days

    // Add JWT to cookie
    const cookieOptions = {
      httpOnly: true, // Prevent client-side JavaScript access
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in milliseconds
      secure: process.env.NODE_ENV === "production", // Set secure flag only in production
    };
    res.cookie("jwt", token, cookieOptions);

    user.password = "";

    return res.status(201).json({ message: "Signed up suceessfully", user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { query, password } = req.body;
    if (!query || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({
      $or: [{ email: query }, { username: query }],
    });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    // JWT Token Generation
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ user }, jwtSecretKey, {
      expiresIn: "15d",
    }); // Token expires in 15days

    // Add JWT to cookie
    const cookieOptions = {
      httpOnly: true, // Prevent client-side JavaScript access
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in milliseconds
      secure: process.env.NODE_ENV === "production", // Set secure flag only in production
    };
    res.cookie("jwt", token, cookieOptions);

    user.password = "";

    return res.status(201).json({ message: "Logged in successfully", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true }); // Set maxAge to 0 to expire the cookie immediately
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { username, newPassword, confirmNewPassword } = req.body;

    if (!username || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "Please fill all the required fields." });
    }

    const user = await User.find({ username });
    if (!user) {
      return res.status(404).json({ error: "Invalid username." });
    }
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password doesn't match." });
    }

    const password = await bcrypt.hash(newPassword, 12);
    const updatedUser = await User.findOneAndUpdate(
      {
        username,
      },
      {
        password,
      }
    );

    updatedUser.password = null;

    return res
      .status(200)
      .json({ message: "Password changed successfully.", updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { fullname, profilePhoto } = req.body;

    const currentUser = req.user;
    const user = await User.findById(currentUser._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let cloudinaryUrl;
    if (profilePhoto) {
      // Check if user already has a profile photo
      if (user.profilePhoto) {
        await cloudinary.uploader.destroy(
          user.profilePhoto.split("/").pop().split(".")[0]
        );
      }
      const response = await cloudinary.uploader.upload(profilePhoto);
      cloudinaryUrl = response.secure_url;
    }

    user.profilePhoto = cloudinaryUrl || user.profilePhoto;
    user.fullname = fullname || user.fullname;

    await user.save();

    user.password = "";
    res.status(201).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  let user;
  const { query } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.params; // Assuming search term comes from query parameter

    if (!query) {
      return res.status(400).json({ error: "Please provide a search term" });
    }

    const regex = new RegExp(query, "i"); // Case-insensitive search

    const users = await User.find({
      $or: [{ fullname: regex }, { username: regex }],
    })
      .limit(5) // Limit results to 5 users
      .select("-password"); // Exclude password field from response

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found matching the search term" });
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = req.user;

    // const suggestedUsers = await User.find({
    //   _id: { $ne: currentUserId },
    //   _id: { $nin: currentUser.friends }
    // });

    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $ne: currentUser._id } } },
      { $match: { _id: { $nin: currentUser.friends } } },
      { $sample: { size: 4 } },
    ]);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  signup,
  login,
  logout,
  updateUserProfile,
  getUser,
  searchUsers,
  getSuggestedUsers,
  forgotPassword,
};
