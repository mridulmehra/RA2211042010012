import {
  users,
  posts,
  comments,
  likes,
  type User,
  type InsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Like,
  type InsertLike
} from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTopUsers(limit?: number): Promise<User[]>;
  
  // Post methods
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getFeedPosts(limit?: number): Promise<Post[]>;
  getTrendingPosts(limit?: number): Promise<Post[]>;
  getUserPosts(userId: number): Promise<Post[]>;
  
  // Comment methods
  getPostComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Like methods
  likePost(like: InsertLike): Promise<Like>;
  unlikePost(userId: number, postId: number): Promise<void>;
  hasUserLikedPost(userId: number, postId: number): Promise<boolean>;
  
  // Stats methods
  getStats(): Promise<{ totalUsers: number; totalPosts: number; avgPostsPerUser: number }>;
}

export class MemStorage implements IStorage {
  private userMap: Map<number, User>;
  private postMap: Map<number, Post>;
  private commentMap: Map<number, Comment>;
  private likeMap: Map<number, Like>;
  private currentUserId: number;
  private currentPostId: number;
  private currentCommentId: number;
  private currentLikeId: number;

  constructor() {
    this.userMap = new Map();
    this.postMap = new Map();
    this.commentMap = new Map();
    this.likeMap = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentCommentId = 1;
    this.currentLikeId = 1;
    
    // Initialize with test data
    this.initializeTestData();
  }

  private initializeTestData() {
    // Create some test users
    const testUsers = [
      { username: "John Doe", password: "password" },
      { username: "Jane Smith", password: "password" },
      { username: "Alex Johnson", password: "password" },
      { username: "Maria Garcia", password: "password" },
      { username: "David Kim", password: "password" },
      { username: "Sarah Wilson", password: "password" },
      { username: "Michael Brown", password: "password" }
    ];
    
    testUsers.forEach(user => this.createUser(user));
    
    // Create test posts for users
    const postContents = [
      "Amazing elephant sighting on my recent safari trip! These gentle giants are truly magnificent creatures. What do you think? #Wildlife #Safari #Elephant",
      "Just spotted this amazing ant colony in my backyard. The complexity of their organization is truly fascinating! #Nature #Insects #Biology",
      "Just finished my morning hike! The sunrise was absolutely breathtaking today. #MorningHike #Nature #Sunrise",
      "Just got my hands on the latest tech gadget! Can't wait to try it out and see if it lives up to the hype. Has anyone else tried it yet? #TechNews #Gadgets",
      "Made an incredible pasta dish for dinner tonight! The secret is in the sauce. #Cooking #FoodLover #Homemade",
      "Can't believe how fast my garden is growing this year! Look at these tomatoes! #Gardening #GrowYourOwn #Summer",
      "Work from home view today. So grateful for this flexibility. #RemoteWork #DigitalNomad #WorkLifeBalance",
      "My new art project is coming along nicely. It's all about expression through color. #Art #Creative #WIP"
    ];
    
    // Assign different numbers of posts to each user to create ranking
    const postsPerUser = [23, 19, 17, 15, 13, 10, 8];
    
    this.userMap.forEach((user, userId) => {
      const numPosts = postsPerUser[userId - 1] || 5;
      for (let i = 0; i < numPosts; i++) {
        const randomContent = postContents[Math.floor(Math.random() * postContents.length)];
        const hasImage = Math.random() > 0.3; // 70% chance to have an image
        
        this.createPost({
          userId,
          content: randomContent,
          hasImage
        });
      }
    });
    
    // Add comments to posts
    const commentContents = [
      "Such beautiful creatures! I was lucky enough to see them in Kenya last year.",
      "Did you know elephants can communicate through the ground? They make low-frequency sounds that travel through the earth!",
      "This is absolutely fascinating! I've always been interested in ant colonies.",
      "Amazing photo! The colors are so vibrant.",
      "I tried it last week and it's definitely worth the hype!",
      "This looks delicious! Would you mind sharing your recipe?",
      "Your garden is thriving! Any tips for a beginner?",
      "That view is incredible! What a great workspace.",
      "The use of color is really striking. Can't wait to see the finished piece!"
    ];
    
    // Add more comments to some posts to create trending posts
    this.postMap.forEach((post, postId) => {
      const commentsCount = postId === 1 || postId === 2 ? 15 : Math.floor(Math.random() * 8) + 1;
      
      for (let i = 0; i < commentsCount; i++) {
        const randomUserId = Math.floor(Math.random() * this.userMap.size) + 1;
        const randomContent = commentContents[Math.floor(Math.random() * commentContents.length)];
        
        this.createComment({
          postId,
          userId: randomUserId,
          content: randomContent
        });
      }
      
      // Add some random likes to posts
      const likesCount = Math.floor(Math.random() * 30) + 5;
      const usedUserIds = new Set<number>();
      
      for (let i = 0; i < likesCount; i++) {
        let randomUserId;
        do {
          randomUserId = Math.floor(Math.random() * this.userMap.size) + 1;
        } while (usedUserIds.has(randomUserId));
        
        usedUserIds.add(randomUserId);
        
        this.likePost({
          postId,
          userId: randomUserId
        });
      }
      
      // Add random shares
      post.shares = Math.floor(Math.random() * 15);
    });
    
    // Update user stats
    this.updateUserStats();
  }

  private updateUserStats() {
    // Reset all user stats
    this.userMap.forEach(user => {
      user.postCount = 0;
      user.comments = 0;
      user.likes = 0;
      user.followers = Math.floor(Math.random() * 1000) + 100; // Random followers count
    });
    
    // Count posts per user
    this.postMap.forEach(post => {
      const user = this.userMap.get(post.userId);
      if (user) {
        user.postCount += 1;
      }
    });
    
    // Count comments per user
    this.commentMap.forEach(comment => {
      const user = this.userMap.get(comment.userId);
      if (user) {
        user.comments += 1;
      }
    });
    
    // Count likes received per user
    this.likeMap.forEach(like => {
      const post = this.postMap.get(like.postId);
      if (post) {
        const user = this.userMap.get(post.userId);
        if (user) {
          user.likes += 1;
        }
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.userMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      postCount: 0,
      followers: 0,
      comments: 0,
      likes: 0
    };
    this.userMap.set(id, user);
    return user;
  }

  async getTopUsers(limit: number = 5): Promise<User[]> {
    return Array.from(this.userMap.values())
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit);
  }

  // Post methods
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const user = await this.getUser(insertPost.userId);
    
    if (!user) {
      throw new Error(`User with ID ${insertPost.userId} not found`);
    }
    
    const post: Post = {
      ...insertPost,
      id,
      likes: 0,
      shares: 0,
      createdAt: new Date(),
      username: user.username,
      comments: []
    };
    
    this.postMap.set(id, post);
    
    // Update user's post count
    user.postCount += 1;
    
    return post;
  }

  async getPost(id: number): Promise<Post | undefined> {
    const post = this.postMap.get(id);
    
    if (post) {
      // Get post comments
      post.comments = await this.getPostComments(id);
    }
    
    return post;
  }

  async getFeedPosts(limit: number = 20): Promise<Post[]> {
    const posts = Array.from(this.postMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    // Attach comments to each post
    for (const post of posts) {
      post.comments = await this.getPostComments(post.id);
    }
    
    return posts;
  }

  async getTrendingPosts(limit: number = 5): Promise<Post[]> {
    const posts = Array.from(this.postMap.values());
    
    // Attach comments to each post
    for (const post of posts) {
      post.comments = await this.getPostComments(post.id);
    }
    
    // Sort by number of comments
    return posts
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, limit);
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.postMap.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Comment methods
  async getPostComments(postId: number): Promise<Comment[]> {
    const comments = Array.from(this.commentMap.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Attach username to each comment
    for (const comment of comments) {
      const user = await this.getUser(comment.userId);
      comment.username = user?.username || "Unknown User";
      comment.timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    }
    
    return comments;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const user = await this.getUser(insertComment.userId);
    
    if (!user) {
      throw new Error(`User with ID ${insertComment.userId} not found`);
    }
    
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
      username: user.username,
      timeAgo: "just now"
    };
    
    this.commentMap.set(id, comment);
    
    // Update user's comment count
    user.comments += 1;
    
    return comment;
  }

  // Like methods
  async likePost(insertLike: InsertLike): Promise<Like> {
    // Check if user has already liked the post
    const hasLiked = await this.hasUserLikedPost(insertLike.userId, insertLike.postId);
    
    if (hasLiked) {
      throw new Error(`User ${insertLike.userId} has already liked post ${insertLike.postId}`);
    }
    
    const id = this.currentLikeId++;
    const like: Like = {
      ...insertLike,
      id,
      createdAt: new Date()
    };
    
    this.likeMap.set(id, like);
    
    // Increment post like count
    const post = this.postMap.get(insertLike.postId);
    if (post) {
      post.likes += 1;
    }
    
    return like;
  }

  async unlikePost(userId: number, postId: number): Promise<void> {
    const like = Array.from(this.likeMap.values()).find(
      like => like.userId === userId && like.postId === postId
    );
    
    if (!like) {
      return;
    }
    
    this.likeMap.delete(like.id);
    
    // Decrement post like count
    const post = this.postMap.get(postId);
    if (post && post.likes > 0) {
      post.likes -= 1;
    }
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<boolean> {
    return Array.from(this.likeMap.values()).some(
      like => like.userId === userId && like.postId === postId
    );
  }

  // Stats methods
  async getStats(): Promise<{ totalUsers: number; totalPosts: number; avgPostsPerUser: number }> {
    const totalUsers = this.userMap.size;
    const totalPosts = this.postMap.size;
    const avgPostsPerUser = totalUsers > 0 ? totalPosts / totalUsers : 0;
    
    return {
      totalUsers,
      totalPosts,
      avgPostsPerUser: Math.round(avgPostsPerUser)
    };
  }
}

export const storage = new MemStorage();
