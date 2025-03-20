import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  postCount: integer("post_count").notNull().default(0),
  followers: integer("followers").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  likes: integer("likes").notNull().default(0),
});

// Posts schema
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  hasImage: boolean("has_image").notNull().default(false),
  likes: integer("likes").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Comments schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Likes schema (to track which users liked which posts)
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  postCount: true,
  followers: true,
  comments: true,
  likes: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes: true,
  shares: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Post = typeof posts.$inferSelect & {
  username: string;
  comments: Comment[];
  hasLiked?: boolean;
};
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect & {
  username: string;
  timeAgo: string;
};
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
