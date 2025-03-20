import { Skeleton } from "@/components/ui/skeleton";
import { generateRandomImageUrl } from "@/lib/utils";
import { User } from "@shared/schema";
import { useMemo } from "react";

interface UserCardProps {
  user: User;
  topCount: number;
}

const UserCard = ({ user, topCount }: UserCardProps) => {
  // Generate a stable random image URL for this user
  const imageUrl = useMemo(() => generateRandomImageUrl(`user-${user.id}`), [user.id]);
  
  // Calculate percentage of top user's post count
  const percentage = Math.round((user.postCount / topCount) * 100);
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white p-0.5 shadow-sm">
            <img
              src={imageUrl}
              className="w-full h-full object-cover rounded-full"
              alt={`${user.username} profile`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.username}</h3>
            <p className="text-slate-500 text-sm">@{user.username.toLowerCase().replace(/\s+/g, '')}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-primary font-bold text-2xl">{user.postCount}</div>
            <div className="text-xs text-slate-500">posts</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between text-sm mb-3">
          <div>
            <span className="font-semibold">{user.followers}</span>
            <span className="text-slate-500"> Followers</span>
          </div>
          <div>
            <span className="font-semibold">{user.comments}</span>
            <span className="text-slate-500"> Comments</span>
          </div>
          <div>
            <span className="font-semibold">{user.likes}</span>
            <span className="text-slate-500"> Likes</span>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {percentage}% of top poster's count
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for the user card
UserCard.Skeleton = function UserCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-8 w-12 mb-1" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between text-sm mb-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-2 w-full rounded-full mb-2" />
        <Skeleton className="h-3 w-32 mt-2" />
      </div>
    </div>
  );
};

export default UserCard;
