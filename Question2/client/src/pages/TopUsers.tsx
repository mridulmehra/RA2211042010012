import { useQuery } from "@tanstack/react-query";
import UserCard from "@/components/users/UserCard";
import StatCard from "@/components/stats/StatCard";
import { User } from "@shared/schema";

function TopUsers() {
  // Fetch top users data
  const { data: topUsers, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users/top"],
  });

  // Fetch stats data
  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalUsers: number;
    totalPosts: number;
    avgPostsPerUser: number;
  }>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="pb-16 md:pb-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="ri-user-star-line"></i> Top Users
          <span className="text-sm font-normal text-slate-500 ml-2">by post count</span>
        </h2>
        <p className="text-slate-600 mb-4">
          Users with the highest number of posts across the platform
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statsLoading ? (
          <>
            <StatCard.Skeleton />
            <StatCard.Skeleton />
            <StatCard.Skeleton />
          </>
        ) : stats ? (
          <>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon="ri-user-line"
              iconColor="text-primary"
              trend={{ value: 12, isUp: true, label: "from last month" }}
            />
            <StatCard
              title="Total Posts"
              value={stats.totalPosts}
              icon="ri-chat-1-line"
              iconColor="text-secondary"
              trend={{ value: 8, isUp: true, label: "from last month" }}
            />
            <StatCard
              title="Avg. Posts/User"
              value={stats.avgPostsPerUser}
              icon="ri-bar-chart-line"
              iconColor="text-accent"
              trend={{ value: 3, isUp: false, label: "from last month" }}
            />
          </>
        ) : null}
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {usersLoading ? (
          <>
            <UserCard.Skeleton />
            <UserCard.Skeleton />
            <UserCard.Skeleton />
            <UserCard.Skeleton />
            <UserCard.Skeleton />
          </>
        ) : topUsers && topUsers.length > 0 ? (
          topUsers.map((user) => (
            <UserCard key={user.id} user={user} topCount={topUsers[0].postCount} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-slate-500">No user data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopUsers;
