import express from "express";

import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
}
from "../controllers/recordController.js";

import { protect }
from "../middlewares/authMiddleware.js";

import { authorizeRoles }
from "../middlewares/roleMiddleware.js";

const FinancialRouter = express.Router();


// ============================
// Create Record
// Admin & Analyst only
// ============================

FinancialRouter.post(
  "/create",
  protect,
  authorizeRoles("admin", "analyst"),
  createRecord
);


// ============================
// Get Records
// All roles allowed
// ============================

FinancialRouter.get(
  "/all-records",
  protect,
  authorizeRoles("viewer", "analyst", "admin"),
  getRecords
);




// ============================
// Update Record
// Admin only
// ============================

FinancialRouter.put(
  "/update-financial-records/:id",
  protect,
  authorizeRoles("admin"),
  updateRecord
);


// ============================
// Delete Record
// Admin only
// ============================

FinancialRouter.delete(
  "/delete-financial-records/:id",
  protect,
  authorizeRoles("admin"),
  deleteRecord
);

export default FinancialRouter;