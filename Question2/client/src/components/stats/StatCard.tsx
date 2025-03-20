import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  iconColor: string;
  trend?: {
    value: number;
    isUp: boolean;
    label: string;
  };
}

const StatCard = ({ title, value, icon, iconColor, trend }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
      <div className="flex justify-between">
        <h3 className="font-semibold text-slate-600">{title}</h3>
        <i className={`${icon} ${iconColor}`}></i>
      </div>
      <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
      {trend && (
        <div
          className={`text-xs ${
            trend.isUp ? "text-green-600" : "text-red-500"
          } mt-1 flex items-center`}
        >
          <i
            className={`${
              trend.isUp ? "ri-arrow-up-line" : "ri-arrow-down-line"
            } mr-1`}
          ></i>
          {trend.value}% {trend.label}
        </div>
      )}
    </div>
  );
};

StatCard.Skeleton = function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-9 w-24 mt-2" />
      <Skeleton className="h-4 w-32 mt-1" />
    </div>
  );
};

export default StatCard;
