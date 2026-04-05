import User from "../models/User.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { generateToken } from "../utils/generateToken.js";

// Register User

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters and 1 number",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "User is inactive",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Users (Admin)

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Logged-in User Details

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update User Details

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,

      {
        name,
        email,
      },

      { returnDocument: "after" },
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update User Status

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,

      { status },

      { returnDocument: "after" },
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Change Password

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password incorrect",
      });
    }

    if (
      !validator.isStrongPassword(newPassword, {
        minLength: 6,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        message: "New password not strong enough",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
