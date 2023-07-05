import { RecipeModel } from "../models/Recipes.js"



exports.exploreRecipe = async(req,res) => {
    try{
        let recipeId = req.params.id;
        const recipe = await RecipeModel.findById(recipeId);
        res.render('recipe',recipe);
    }catch(err){
        console.error(err);
    }
}