import express from 'express';
import multer from 'multer';
import { PostModel } from '../models/Post.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: '../client/public/uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage }).single('image');

// Create a new post
router.post('/', upload,async (req, res) => {
  try {
    const { description, user, pic } = req.body;
    const image =  req.file.filename ;

    const post = new PostModel({
      user,
      pic,
      description,
      image
    });

    // console.log(post);
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create post' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Like a post
router.put('/like/:postId', async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      // User already liked the post, remove the like
      post.likes.pull(userId);
    } else {
      // User hasn't liked the post, add the like
      post.likes.push(userId);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
  
  // Add a comment to a post
  router.post('/comment/:postId', async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;
      const { text } = req.body;
  
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const comment = {
        user: userId,
        text
      };
  
      post.comments.push(comment);
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
export { router as postsRouter };
