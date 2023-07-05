import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, requried: true, unique: true},
    password: { type: String, requried: true},
    email: { type: String, requried: true, unique: true},
    profilepic:{ type: String, default: 'default-avatar.png' },
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId,ref: "recipes"}],
    postRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }]
});

export const UserModel = mongoose.model("users",UserSchema);