import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";

const router = express.Router();
router.get("/profile", async (req ,res ) => {
  try{
      const response = await UserModel.find({});
      res.json(response);
  } catch(err) {
      res.json(err);

  }
});
// GET route to retrieve user information based on userID
router.get('/:userID', async (req, res) => {
  try {
    const { userID } = req.params;

    // Find the user in the database by userID
    const user = await UserModel.findById(userID);

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user information
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get("/profile/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    // console.log("User ID:", userID); // Log the userID
    const user = await UserModel.findById(userID);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the username and profile picture/avatar in the response
    const { username, profilepic } = user;
    
    // Check if the user has a profile picture
    const avatar = profilepic ? `/profilepics/${profilepic}` : '/default-avatar.png';
    res.json({ username, avatar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/register" , async (req,res) => {
    const { username, password, email} =  req.body;

      // Check if any of the required fields are empty
  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Check if the username is already taken
    const user = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (user) {
        return res.status(400).json({ message: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({ email, username, password: hashedPassword});
    await newUser.save();

    res.json({ message:"User Register Successfully!"});
});


router.post("/login", async (req, res) => {
    const { identifier, password } = req.body;
    // console.log('Login request:', identifier, password); // Log the request parameters
    
    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    // console.log('User found:', user); // Log the retrieved user
    
    if (!user) {
      // console.log('User not found'); // Log the condition
      return res.status(404).json({ message: "User Doesn't Exist!" });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log('Is password valid:', isPasswordValid); // Log the password comparison result
  
    if (!isPasswordValid) {
      // console.log('Incorrect password'); // Log the condition
      return res.status(404).json({ message: "Username or Password is Incorrect" });
    }
  
    const token = jwt.sign({ id: user._id }, "secret");
    // console.log('Login successful. Token:', token); // Log the generated token
    res.json({ token, userID: user._id });
  });


export { router as userRouter };

export const verifyToken = (req ,res ,next ) =>{
  const token = req.headers.authorization;
  if(token){
      jwt.verify(token, "secret", (err)=>{
          if(err) return res.sendStatus(403);
          next();
      });
  }else{
      res.sendStatus(401);
  }

};