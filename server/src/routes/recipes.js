import express from "express";
import { verifyToken } from "./users.js";
import { RecipeModel } from "../models/Recipes.js"
import { UserModel } from "../models/User.js";


const router = express.Router();

router.get("/createrecipe/:id", async (req, res) => {
    try {
        let recipeId = req.params.id;
        
        // Validate the id value
        if (!recipeId) {
          throw new Error('Invalid recipe ID');
        }
        
        // console.log("Recipe ID:", recipeId);
        const response = await RecipeModel.findById(recipeId);
        res.json(response);
        // console.log("Fetched Recipe:", response);
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
      }
    });

router.get("/", async (req ,res ) => {
    try{
        const response = await RecipeModel.aggregate([{ $sample: { size: 10} }])
        res.json(response);
    } catch(err) {
        res.json(err);

    }
});

router.post("/", async (req ,res ) => {
    const recipe = new RecipeModel(req.body);
    try{
        const response = await recipe.save();
        res.json(response);
    } catch(err) {
        res.json(err);

    }
});
router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);

    // Check if the recipe is already present in the savedRecipes array
    const isRecipeAlreadySaved = user.savedRecipes.some((savedRecipe) => savedRecipe.equals(recipe._id));
    if (!isRecipeAlreadySaved) {
      user.savedRecipes.push(recipe);
      await user.save();
    }

    const savedRecipes = await RecipeModel.find({ _id: { $in: user.savedRecipes } });
    res.json({ savedRecipes });
  } catch (err) {
    res.json(err);
  }
});


router.get("/savedRecipes/ids/:userID",async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    }catch(err){
        res.json(err);
    }
});

router.get("/savedRecipes/:userID",async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({_id: {$in: user.savedRecipes},});
        res.json({ savedRecipes });
    }catch(err){
        res.json(err);
    }
});

// ...

router.delete("/savedRecipes/:id", async (req, res) => {
  try {
    console.log("Received DELETE request"); // Add this line
    const recipeID = req.params.id;
    const userID = req.user.id;
    console.log("Recipe ID:", recipeID); // Add this line
    console.log("User ID:", userID); // Add this line
    // Remove the recipe from the user's savedRecipes array
    const user = await UserModel.findById(userID);
    console.log("User:", user); // Add this line
    user.savedRecipes = user.savedRecipes.filter(id => id !== recipeID);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove recipe from saved recipes" });
  }
});


router.get("/search", async (req, res) => {
    try {
      const searchText = req.query.q; // Get the search query from request query parameter 'q'
      const response = await RecipeModel.find(
        {
          $or: [
            { title: { $regex: searchText, $options: "i" } }, // Case-insensitive search on the title field
            { category: { $regex: searchText, $options: "i" } }, // Case-insensitive search on the category field
          ],
        }
      );
  
      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to search recipes" });
    }
  });
  
  
export { router as recipesRouter };

