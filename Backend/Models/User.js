const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key");
}

const userSchema = new mongoose.Schema({
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
  portId: {
    type: String,
    default: null,

  },
  salt: {
    type: String,
  },
  mobileno: {
    type: String,
    required: true,
    unique: true
  },
  imgUrl: {
    type: String,
    default: "/public/download.png"
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN" ,"SYSTEM ADMIN"],
    default: "USER",
  },
  orders: {
    type: Array,
    default: [],
  },
}, { timestamps: true });


userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = crypto.randomBytes(12).toString("hex");
  const hashedPassword = crypto.createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  // Assign the generated salt and hashed password to the schema
  user.salt = salt;
  user.password = hashedPassword;

  next();
});

// Static method to match password and generate a JWT token
userSchema.statics.matchPasswordAndGenrateToken = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found!");
  }
  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedHash = crypto.createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (userProvidedHash !== hashedPassword) {
    throw new Error("Invalid Password!");
  }
  const token = createTokenForUser(user);
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
