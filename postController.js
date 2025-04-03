// Schema for post
const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    const newPost = new Post({ user: userId, content });
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Like or Unlike a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({ message: 'Post unliked' });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ message: 'Post liked' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Comment on a post
exports.commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newComment = { user: userId, text };
    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
