import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TrendingPostCard from "@/components/posts/TrendingPostCard";
import { Post } from "@shared/schema";

type FilterPeriod = "24h" | "7d" | "30d";
type SortOption = "comments" | "likes" | "shares";

function TrendingPosts() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("24h");
  const [sortBy, setSortBy] = useState<SortOption>("comments");

  // Fetch trending posts data
  const { data: trendingPosts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts/trending", { period: filterPeriod, sortBy }],
  });

  return (
    <div className="pb-16 md:pb-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="ri-fire-line"></i> Trending Posts
          <span className="text-sm font-normal text-slate-500 ml-2">by comment count</span>
        </h2>
        <p className="text-slate-600 mb-4">
          Posts with the highest engagement across the platform
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <div className="font-medium text-slate-700">Filter by:</div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filterPeriod === "24h" ? "bg-blue-50 text-primary" : "hover:bg-slate-50"
            }`}
            onClick={() => setFilterPeriod("24h")}
          >
            Last 24 Hours
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filterPeriod === "7d" ? "bg-blue-50 text-primary" : "hover:bg-slate-50"
            }`}
            onClick={() => setFilterPeriod("7d")}
          >
            Last 7 Days
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filterPeriod === "30d" ? "bg-blue-50 text-primary" : "hover:bg-slate-50"
            }`}
            onClick={() => setFilterPeriod("30d")}
          >
            Last 30 Days
          </button>
        </div>
        <div className="ml-auto">
          <select
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="comments">Sort by Comments</option>
            <option value="likes">Sort by Likes</option>
            <option value="shares">Sort by Shares</option>
          </select>
        </div>
      </div>

      {/* Trending Posts */}
      <div className="space-y-6">
        {isLoading ? (
          <>
            <TrendingPostCard.Skeleton />
            <TrendingPostCard.Skeleton />
          </>
        ) : trendingPosts && trendingPosts.length > 0 ? (
          trendingPosts.map((post, index) => (
            <TrendingPostCard 
              key={post.id} 
              post={post} 
              rank={index + 1}
            />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <p className="text-slate-500">No trending posts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrendingPosts;
