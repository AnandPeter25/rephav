import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
    title: { type: String, requried: true,},
    description: { type: String, requried: true},
    ingredients: { type: Array, requried: true},
    instructions: { type: Array, requried: true, },
    imageUrl: { type: String, requried: true, },
    category: { type: String, requried: true, },
    cookingTime: { type: Number, requried: true, },
    userOwner: { type: mongoose.Schema.Types.ObjectId,ref: "users",requried : true },
});

// Create a text index on 'title' and 'category' fields
RecipeSchema.index({ title: 'text', category: 'text' });   

export const RecipeModel = mongoose.model("recipes", RecipeSchema);