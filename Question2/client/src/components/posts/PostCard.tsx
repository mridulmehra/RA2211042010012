import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { generateRandomImageUrl } from "@/lib/utils";
import { Post } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  children?: React.ReactNode;
}

const PostCard = ({ post, children }: PostCardProps) => {
  // Generate stable random image URLs
  const userImageUrl = useMemo(
    () => generateRandomImageUrl(`user-${post.userId}`),
    [post.userId]
  );
  
  const postImageUrl = useMemo(
    () => generateRandomImageUrl(`post-${post.id}`),
    [post.id]
  );
  
  // Format the post date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
      {/* Post Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img
            src={userImageUrl}
            className="w-full h-full object-cover"
            alt={`${post.username} profile`}
          />
        </div>
        <div>
          <h3 className="font-semibold">{post.username}</h3>
          <p className="text-slate-500 text-xs">Posted {formattedDate}</p>
        </div>
        {children}
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="mb-4">{post.content}</p>
        {post.hasImage && (
          <div className="rounded-lg overflow-hidden mb-4 aspect-[16/9]">
            <img
              src={postImageUrl}
              className="w-full h-full object-cover"
              alt={`Post by ${post.username}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

PostCard.Skeleton = function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-4" />
        <Skeleton className="w-full h-48 rounded-lg mb-4" />
      </div>
    </div>
  );
};

export default PostCard;
