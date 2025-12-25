const express = require("express");
const User = require("../Models/User");
const upload = require("../middlewares/storage");
const fs = require("fs");
const cloudinary = require("cloudinary")
const { authenticateToken, authorizeSystemAdmin } = require("../middlewares/authentication");

const userRoute = express.Router();

userRoute.post("/signup/post", upload.single("profile"), async (req, res) => {
  try {
    const { name, email, password, mobileno, role, portId } = req.body;
    
    const profilePhoto = req.file
    console.log(profilePhoto)
    if (!name || !email || !password || !mobileno || !role) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    // console.log(cloudinary)
    const imageUpload = await cloudinary.uploader.upload(profilePhoto.path, { resource_type: 'image' })
    const imgUrl = imageUpload.secure_url
    console.log(imageUpload.secure_url)
    console.log(imgUrl, "imgUrl")
    // const imgUrl = req.file
    //   ? `/uploads/${req.file.filename}`
    //   : "/uploads/download.png";
    const newUser = new User({
      name,
      email,
      password,
      mobileno,
      role,
      imgUrl,
      portId: role === "ADMIN" ? portId : null,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Sign-up successful",
      user: savedUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * SIGN IN
 */
userRoute.post("/signin/post", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const token = await User.matchPasswordAndGenrateToken(email, password);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Sign in successful",
      userId: user._id,
      portId: user.portId,
      isAdmin: user.role === "ADMIN",
      isSystemAdmin: user.role === "SYSTEM ADMIN",
      token,
      userProfilePhoto: user.imgUrl,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * LOGOUT
 */
userRoute.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

/**
 * GET ALL USERS
 */
userRoute.get("/all", authenticateToken, authorizeSystemAdmin, async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched all users",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET USER BY ID
 */
userRoute.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * UPDATE USER
 */
userRoute.put("/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    delete updateData.password; // prevent password overwrite

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * DELETE USER
 */
userRoute.delete(
  "/:userId",
  authenticateToken,
  authorizeSystemAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${userId} not found`,
        });
      }

      await User.deleteOne({ _id: userId });

      return res.status(200).json({
        success: true,
        message: `User ${existingUser.name} deleted successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

userRoute.post("/contact", (req, res) => {
  const { name, email, message, phone } = req.body;
  if (!name || !email || !message || !phone) {
    return res.status(400).json({ error: "All fields required" });
  }

  const dateTime = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium"
  });

  const entry = `
-------------------------
Date: ${dateTime}
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}

-------------------------
`;

  fs.appendFile("contacts.txt", entry, (error) => {
    if (error) {
      return res.status(500).json({ error: "Failed to save contact" });
    }
    res.json({ success: true, message: "review submitted" });
  });
});

module.exports = userRoute;