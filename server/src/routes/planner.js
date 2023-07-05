import express from 'express';
import { PlanModel } from '../models/Planner.js';
const router = express.Router();

// POST route to save the meal plan
router.post("/mealplan", async (req, res) => {
  try {
    const mealPlan = req.body.mealPlan;
    
    // Perform the necessary operations to save the meal plan
    // ...
    
    // Send a success response
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save meal plan" });
  }
});

export { router as plansRouter };
