import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: { type: String,required: true },
  pic:{ type: String,required: true},
  description: {type: String,required: true },
  image: {type: String,required: true},
  likes: [{type: mongoose.Schema.Types.ObjectId,ref: 'Users' }],
  comments: [
    {
      user: {type: mongoose.Schema.Types.ObjectId,ref: 'Users',required: true},
      text: {type: String,required: true},
      createdAt: { type: Date, default: Date.now}
    }
  ],
  createdAt: { type: Date,default: Date.now}
});

const PostModel = mongoose.model('Post', postSchema);

export { PostModel };
