import { useState } from "react";
import PostCard from "./PostCard";
import { Post } from "@shared/schema";

interface TrendingPostCardProps {
  post: Post;
  rank: number;
}

const TrendingPostCard = ({ post, rank }: TrendingPostCardProps) => {
  const [showAllComments, setShowAllComments] = useState(false);

  // Display at most 2 comments when not expanded
  const displayedComments = showAllComments
    ? post.comments
    : post.comments.slice(0, 2);

  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  return (
    <PostCard
      post={post}
      children={
        <div className="ml-auto">
          <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
            <i className="ri-fire-line mr-1"></i> Trending #{rank}
          </span>
        </div>
      }
    >
      {/* Stats */}
      <div className="flex justify-between text-sm text-slate-600 mb-3">
        <div className="flex items-center gap-1">
          <i className="ri-message-3-line"></i>
          <span className="font-semibold">{post.comments.length} comments</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="ri-heart-line"></i>
          <span>{post.likes} likes</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="ri-share-forward-line"></i>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Comments Preview */}
      {post.comments.length > 0 ? (
        <div className="bg-slate-50 rounded-lg p-3 space-y-3">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center">
                <i className="ri-user-line text-slate-500 text-xs"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <h4 className="font-semibold text-sm">{comment.username}</h4>
                  <span className="text-xs text-slate-500">
                    {comment.timeAgo}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
                <div className="mt-1 text-xs flex gap-3 text-slate-500">
                  <button className="hover:text-primary">Like</button>
                  <button className="hover:text-primary">Reply</button>
                </div>
              </div>
            </div>
          ))}

          {post.comments.length > 2 && (
            <div className="text-center text-xs">
              <button
                className="text-primary font-medium"
                onClick={toggleComments}
              >
                {showAllComments
                  ? "Show less"
                  : `View all ${post.comments.length} comments`}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500 py-2">
          No comments yet
        </div>
      )}
    </PostCard>
  );
};

TrendingPostCard.Skeleton = function TrendingPostCardSkeleton() {
  return <PostCard.Skeleton />;
};

export default TrendingPostCard;
