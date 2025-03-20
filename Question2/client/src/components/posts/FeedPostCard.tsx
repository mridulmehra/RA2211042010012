import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PostCard from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@shared/schema";

interface FeedPostCardProps {
  post: Post;
}

const FeedPostCard = ({ post }: FeedPostCardProps) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    try {
      await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Refetch posts to update like count
      queryClient.invalidateQueries({ queryKey: ['/api/posts/feed'] });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
        credentials: 'include'
      });
      
      // Clear form and refetch posts
      setComment("");
      queryClient.invalidateQueries({ queryKey: ['/api/posts/feed'] });
      // Also refetch trending as new comment might affect it
      queryClient.invalidateQueries({ queryKey: ['/api/posts/trending'] });
      
    } catch (error) {
      console.error('Error commenting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PostCard 
      post={post}
      children={
        <button className="ml-auto text-slate-400 hover:text-slate-600">
          <i className="ri-more-fill"></i>
        </button>
      }
    >
      {/* Interaction Bar */}
      <div className="flex justify-between text-sm text-slate-600 pb-3 border-b border-slate-100">
        <button 
          className="flex items-center gap-1 hover:text-primary"
          onClick={handleLike}
        >
          <i className={`${post.hasLiked ? 'ri-heart-fill text-red-500' : 'ri-heart-line'}`}></i>
          <span>Like ({post.likes})</span>
        </button>
        <button className="flex items-center gap-1 hover:text-primary">
          <i className="ri-message-3-line"></i>
          <span>Comment ({post.comments.length})</span>
        </button>
        <button className="flex items-center gap-1 hover:text-primary">
          <i className="ri-share-forward-line"></i>
          <span>Share ({post.shares})</span>
        </button>
      </div>
      
      {/* Comment Input */}
      <form onSubmit={handleComment} className="flex items-center gap-3 mt-3">
        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center">
          <i className="ri-user-line text-slate-500 text-xs"></i>
        </div>
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm disabled:opacity-50"
          disabled={isSubmitting || !comment.trim()}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </PostCard>
  );
};

FeedPostCard.Skeleton = function FeedPostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-6 ml-auto rounded-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-4" />
        <Skeleton className="w-full h-48 rounded-lg mb-4" />
        
        <div className="flex justify-between text-sm pb-3 border-b border-slate-100 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <Skeleton className="flex-1 h-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default FeedPostCard;
