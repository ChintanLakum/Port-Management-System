const express = require("express");
const User = require("../Models/User");
const multer = require('multer');
const path = require("path");
const { authenticateToken, authorizeSystemAdmin } = require("../middlewares/authentication");
const userRoute = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage });

userRoute.post('/signup/post', upload.single('profile'), async (req, res) => {
  try {
    const { name, email, password, mobileno, role, portId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }
    const imgUrl = req.file ? `/uploads/${req.file.filename}` : "../download.png";
    const newUser = new User({
      name,
      email,
      password,
      mobileno,
      role,
      imgUrl,
      portId: role === 'ADMIN' ? portId : null
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User created successfully!",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

userRoute.post('/signin/post', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenrateToken(email, password);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.cookie("token", token, {
      httpOnly: true,
    });
    return res.status(200).json({
      message: "Sign in successful!",
      userId: user._id,
      portId: user.portId,
      isAdmin: user.role === "ADMIN",
      isSystemAdmin: user.role === "SYSTEM ADMIN",
      token: token,
      userProfilePhoto: user.imgUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Incorrect Email or Password" });
  }
});

userRoute.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    message: "Logout successful!"
  });
});

userRoute.get('/all', async (req, res) => {
    try {
        const users = await User.find({});
        if (!users || users.length === 0) {
            return res.status(200).json({ message: "No users available", users: [] });
        }
        return res.status(200).json({
            message: "Successfully fetched all users", 
            users,
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        return res.status(500).json({ message: "Internal Server Error when fetching users" });
    }
});

userRoute.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User Not found with userrId :" });
    }
    return res.status(200).json({
      message: "User Founded Successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "No such user found" });
  }
})


userRoute.put("/:userId",async (req, res) => {
  try {
    const userId = req.params.userId
    const user = req.body
    console.log(userId, "  ", req.body, "  " ,user );
    const updatedUser = await User.findOneAndUpdate({ _id: userId },
       { $set: user },
        {
          new: true,
          runValidators: true,
          context: 'query'
        }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User Not found with userrId :" });
    }
    return res.status(200).json({
      message: "User Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "No such user found" });
  }
})

userRoute.delete('/:userId',authenticateToken, authorizeSystemAdmin,  async (req, res) => {
    const userId = req.params.userId;
    try {
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
        return res.status(404).json({ message: `User with ID ${userId} not found.` });
    }
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 1) {
        return res.status(204).json({ message: `User with Name ${existingUser} was deleted.` });
    } else {
         return res.status(404).json({ message: `User with ID ${userId} was not deleted.` });
    }
} catch (error) {
    console.error('Database error during deletion:', error);
    return res.status(500).json({ message: 'Internal Server Error during database operation.' });
}
});




module.exports = userRoute;

