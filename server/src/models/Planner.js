import mongoose from 'mongoose';

// Define the meal plan schema
const PlanSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  meals: [{
    day: {
      type: String,
      required: true,
    },
    recipeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
  }],
});

// Create the meal plan model
const PlanModel = mongoose.model("Plan", PlanSchema);

export { PlanModel };
