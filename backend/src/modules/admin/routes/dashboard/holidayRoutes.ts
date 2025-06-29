import express from "express";
import {
  createHoliday,
  getAllHolidays,
  filterHolidaysByDate,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
} from "../../controllers/dashboard/holidayController";

const router = express.Router();

// Create a new holiday
router.post("/school/holiday", createHoliday);

// Get all holidays for a school (optionally filtered by schoolId)
router.get("/admin/school/holidays", getAllHolidays);

// Filter holidays by date range
router.get("/school/holiday/filter", filterHolidaysByDate);
// Get a single holiday by ID
router.get("/school/holiday/:id", getHolidayById);
// Update a holiday by ID
router.put("/school/holiday/:id", updateHoliday);
// Delete a holiday by ID
router.delete("/school/holiday/:id", deleteHoliday);

export default router;
