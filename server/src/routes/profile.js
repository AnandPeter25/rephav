import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import express from "express";
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
  destination: '../client/public/pic/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage }).single('image');
// Update username
router.put('/username/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { username } = req.body;
  
      await UserModel.findByIdAndUpdate(id, { username });
  
      res.json({ success: true, message: 'Username updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update username' });
    }
  });
  
  // Update password
  router.put('/password/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
  
      await UserModel.findByIdAndUpdate(id, { password });
  
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update password' });
    }
  });
  //upadate userprofile
  router.post('/userprofile/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserModel.findById(userId);
  
      if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.profilepic =  req.body.profilepic  || user.profilepic;
  
        if (req.body.password) {
          // Hash the password using bcrypt
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          user.password = hashedPassword;
        }
        const updatedUser = await user.save();
  
        res.json({
          _id: updatedUser._id,
          username: updatedUser.username,
          password: updatedUser.password,
          profilepic: updatedUser.profilepic,
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });
  
  // Update profile picture
  router.put('/profilePic/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { profilepic } = req.body;
  
      await UserModel.findByIdAndUpdate(id, { profilepic });
  
      res.json({ success: true, message: 'Profile picture updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile picture' });
    }
  });

export { router as profileRouter };

