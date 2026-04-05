import express from "express";

import {
  registerUser,
  loginUser,
  getUsers,
  getProfile,
  updateUser,
  updateUserStatus,
  changePassword
}
from "../controllers/userController.js";

import {
  protect
}
from "../middlewares/authMiddleware.js";

import {
  authorizeRoles
}
from "../middlewares/roleMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/register", registerUser);

UserRouter.post("/login", loginUser);

UserRouter.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getUsers
);

UserRouter.put(
  "/change-password",
  protect,
  changePassword
);

UserRouter.get(
  "/profile",
  protect,
  getProfile
);

UserRouter.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateUser
);

UserRouter.put(
  "/status/:id",
  protect,
  authorizeRoles("admin"),
  updateUserStatus
);



export default UserRouter;