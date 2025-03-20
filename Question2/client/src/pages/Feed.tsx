import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FeedPostCard from "@/components/posts/FeedPostCard";
import ExternalUsersList from "@/components/external/ExternalUsersList";
import { Post } from "@shared/schema";
import useWebSocket from "@/hooks/useWebSocket";

function Feed() {
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const [showExternalData, setShowExternalData] = useState(false);

  // Fetch feed posts
  const { data: feedPosts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts/feed"],
  });

  // WebSocket connection for real-time feed updates
  const { lastMessage } = useWebSocket('/ws');

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === 'new_post') {
          setHasNewPosts(true);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    }
  }, [lastMessage]);

  // Function to refresh feed and fetch new posts
  const refreshFeed = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
    setHasNewPosts(false);
    
    // Scroll to top when refreshing
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Function to submit a new post
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) return;
    
    try {
      setIsPosting(true);
      
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
        credentials: 'include'
      });
      
      // Clear form and refetch posts
      setNewPostContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="pb-16 md:pb-0" ref={feedRef}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="ri-chat-3-line"></i> Feed
          <span className="text-sm font-normal text-slate-500 ml-2">latest posts</span>
        </h2>
        <p className="text-slate-600 mb-4">
          Real-time feed of all posts across the platform
        </p>
      </div>

      {/* Toggle External Data Button */}
      <button
        onClick={() => setShowExternalData(!showExternalData)}
        className="w-full text-center p-3 mb-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium text-sm transition-colors"
      >
        <i className={`ri-${showExternalData ? 'arrow-up' : 'arrow-down'}-s-line mr-2`}></i>
        {showExternalData ? 'Hide External API Data' : 'Show External API Data'}
      </button>

      {/* External API Data */}
      {showExternalData && <ExternalUsersList />}

      {/* New Post Form */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-100">
        <form onSubmit={handlePostSubmit}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
              <i className="ri-user-line text-slate-500"></i>
            </div>
            <input
              type="text"
              placeholder="What's on your mind?"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              disabled={isPosting}
            />
          </div>
          <div className="flex gap-2 text-sm">
            <button 
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-50 rounded-lg text-slate-600"
            >
              <i className="ri-image-line"></i>
              <span>Photo</span>
            </button>
            <button 
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-50 rounded-lg text-slate-600"
            >
              <i className="ri-emotion-line"></i>
              <span>Feeling</span>
            </button>
            <button 
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
              disabled={isPosting || !newPostContent.trim()}
            >
              <i className="ri-send-plane-line"></i>
              <span>{isPosting ? 'Posting...' : 'Post'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* New Posts Alert */}
      {hasNewPosts && (
        <button
          onClick={refreshFeed}
          className="w-full text-center p-2 mb-4 bg-blue-50 text-primary rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
        >
          <i className="ri-refresh-line"></i>
          <span>New posts available! Click to refresh</span>
        </button>
      )}

      {/* Post Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <>
            <FeedPostCard.Skeleton />
            <FeedPostCard.Skeleton />
          </>
        ) : feedPosts && feedPosts.length > 0 ? (
          feedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <p className="text-slate-500">No posts in your feed yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
