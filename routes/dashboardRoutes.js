import express from "express";

import {
  getDashboardSummary,
  getRecentRecords
} from "../controllers/dashboardController.js";

import {
  protect
} from "../middlewares/authMiddleware.js";

import {
  authorizeRoles
} from "../middlewares/roleMiddleware.js";

const dashboardRouter = express.Router();



// Dashboard Summary Route


dashboardRouter.get(
  "/summary",
  protect,
  authorizeRoles("viewer", "analyst", "admin"),
  getDashboardSummary
);


// Recent Records Route


dashboardRouter.get(
  "/recent",
  protect,
  authorizeRoles("viewer", "analyst", "admin"),
  getRecentRecords
);


export default dashboardRouter;