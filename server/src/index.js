import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js"
import { recipesRouter } from "./routes/recipes.js"
import { postsRouter } from "./routes/posts.js";
import { plansRouter } from "./routes/planner.js";
import { profileRouter} from "./routes/profile.js";



const app = express();
app.use(express.json());

app.use(cors());


app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);
app.use("/posts", postsRouter);
app.use("/plan", plansRouter);
app.use("/profile", profileRouter);


mongoose.connect(
    "mongodb+srv://admin:admin123@recipes.rhzsexi.mongodb.net/recipes?retryWrites=true&w=majority"
    );

app.listen(3001, () => console.log("SERVER STARTED"));
