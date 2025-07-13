import { TrendingUp } from "lucide-react";

export const AnalyticsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-sm ${
            trend > 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-gray-400">{subtitle}</div>
  </div>
);
