import { Post, User, Comment } from "@shared/schema";

// Types for the external API responses
type ExternalUsersResponse = {
  users: Record<string, string>;
};

type ExternalPostsResponse = {
  posts: {
    id: number;
    userid: number;
    content: string;
  }[];
};

type ExternalCommentsResponse = {
  comments: {
    id: number;
    postid: number;
    content: string;
  }[];
};

// Function to fetch the top 5 users by post count
export async function fetchTopUsers(): Promise<User[]> {
  const response = await fetch('/api/users/top');
  if (!response.ok) {
    throw new Error(`Error fetching top users: ${response.statusText}`);
  }
  return response.json();
}

// Function to fetch external users from test API
export async function fetchExternalUsers(): Promise<ExternalUsersResponse> {
  const response = await fetch('/api/external/users');
  if (!response.ok) {
    throw new Error(`Error fetching external users: ${response.statusText}`);
  }
  return response.json();
}

// Function to fetch external posts from a specific user
export async function fetchExternalUserPosts(userId: string): Promise<ExternalPostsResponse> {
  const response = await fetch(`/api/external/users/${userId}/posts`);
  if (!response.ok) {
    throw new Error(`Error fetching external posts: ${response.statusText}`);
  }
  return response.json();
}

// Function to fetch external comments for a specific post
export async function fetchExternalPostComments(postId: number): Promise<ExternalCommentsResponse> {
  const response = await fetch(`/api/external/posts/${postId}/comments`);
  if (!response.ok) {
    throw new Error(`Error fetching external comments: ${response.statusText}`);
  }
  return response.json();
}

// Function to fetch trending posts
export async function fetchTrendingPosts(period: string, sortBy: string): Promise<Post[]> {
  const response = await fetch(`/api/posts/trending?period=${period}&sortBy=${sortBy}`);
  if (!response.ok) {
    throw new Error(`Error fetching trending posts: ${response.statusText}`);
  }
  return response.json();
}

// Function to fetch the feed posts
export async function fetchFeedPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts/feed');
  if (!response.ok) {
    throw new Error(`Error fetching feed posts: ${response.statusText}`);
  }
  return response.json();
}

// Function to fetch comments for a post
export async function fetchPostComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`/api/posts/${postId}/comments`);
  if (!response.ok) {
    throw new Error(`Error fetching comments: ${response.statusText}`);
  }
  return response.json();
}

// Function to like a post
export async function likePost(postId: number): Promise<void> {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Error liking post: ${response.statusText}`);
  }
}

// Function to add a comment to a post
export async function addComment(postId: number, content: string): Promise<Comment> {
  const response = await fetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Error adding comment: ${response.statusText}`);
  }
  return response.json();
}

// Function to create a new post
export async function createPost(content: string): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Error creating post: ${response.statusText}`);
  }
  return response.json();
}

// Function to fetch stats
export async function fetchStats(): Promise<{
  totalUsers: number;
  totalPosts: number;
  avgPostsPerUser: number;
}> {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error(`Error fetching stats: ${response.statusText}`);
  }
  return response.json();
}
