import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

// Store connected clients
const clients = new Set<WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time feed updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
    });
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
  
  // Broadcast message to all connected clients
  const broadcastMessage = (message: object) => {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };
  
  // API Routes
  // Get top users
  app.get('/api/users/top', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const topUsers = await storage.getTopUsers(limit);
      res.json(topUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch top users' });
    }
  });
  
  // Get feed posts
  app.get('/api/posts/feed', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const posts = await storage.getFeedPosts(limit);
      
      // For the sake of this example, assume we have a mock current user ID
      const currentUserId = 1;
      
      // Check if user has liked each post
      for (const post of posts) {
        post.hasLiked = await storage.hasUserLikedPost(currentUserId, post.id);
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch feed posts' });
    }
  });
  
  // Get trending posts
  app.get('/api/posts/trending', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const period = req.query.period || '24h';
      const sortBy = req.query.sortBy || 'comments';
      
      // For now, we're only using the comments count for trending
      // In a real app, period and sortBy would affect the query
      const trendingPosts = await storage.getTrendingPosts(limit);
      
      // For the sake of this example, assume we have a mock current user ID
      const currentUserId = 1;
      
      // Check if user has liked each post
      for (const post of trendingPosts) {
        post.hasLiked = await storage.hasUserLikedPost(currentUserId, post.id);
      }
      
      res.json(trendingPosts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trending posts' });
    }
  });
  
  // Get post comments
  app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }
      
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });
  
  // Create a new post
  app.post('/api/posts', async (req, res) => {
    try {
      // Validate request body
      const postData = insertPostSchema.parse({
        userId: 1, // Mock user ID for the sake of this example
        content: req.body.content,
        hasImage: req.body.hasImage || false
      });
      
      const post = await storage.createPost(postData);
      
      // Notify all clients about the new post
      broadcastMessage({
        type: 'new_post',
        post
      });
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid post data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create post' });
    }
  });
  
  // Add a comment to a post
  app.post('/api/posts/:postId/comments', async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }
      
      // Check if post exists
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      // Validate request body
      const commentData = insertCommentSchema.parse({
        postId,
        userId: 1, // Mock user ID for the sake of this example
        content: req.body.content
      });
      
      const comment = await storage.createComment(commentData);
      
      // Notify all clients about the new comment
      broadcastMessage({
        type: 'new_comment',
        postId,
        comment
      });
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid comment data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });
  
  // Like a post
  app.post('/api/posts/:postId/like', async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }
      
      // Check if post exists
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      const userId = 1; // Mock user ID for the sake of this example
      
      // Check if user has already liked the post
      const hasLiked = await storage.hasUserLikedPost(userId, postId);
      
      if (hasLiked) {
        // Unlike the post
        await storage.unlikePost(userId, postId);
        res.json({ liked: false });
      } else {
        // Like the post
        await storage.likePost({ userId, postId });
        res.json({ liked: true });
      }
      
      // Get updated post and notify clients
      const updatedPost = await storage.getPost(postId);
      if (updatedPost) {
        broadcastMessage({
          type: 'post_liked',
          postId,
          likes: updatedPost.likes
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to like post' });
    }
  });
  
  // Get stats
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });
  
  // Fetch from the external test server APIs
  
  // Bridge to external users API
  app.get('/api/external/users', async (req, res) => {
    try {
      const response = await fetch('http://20.244.56.144/test/users');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching external users:', error);
      res.status(500).json({ error: 'Failed to fetch external users' });
    }
  });
  
  // Bridge to external posts API
  app.get('/api/external/users/:userId/posts', async (req, res) => {
    try {
      const userId = req.params.userId;
      const response = await fetch(`http://20.244.56.144/test/users/${userId}/posts`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching external posts:', error);
      res.status(500).json({ error: 'Failed to fetch external posts' });
    }
  });
  
  // Bridge to external comments API
  app.get('/api/external/posts/:postId/comments', async (req, res) => {
    try {
      const postId = req.params.postId;
      const response = await fetch(`http://20.244.56.144/test/posts/${postId}/comments`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching external comments:', error);
      res.status(500).json({ error: 'Failed to fetch external comments' });
    }
  });

  return httpServer;
}
