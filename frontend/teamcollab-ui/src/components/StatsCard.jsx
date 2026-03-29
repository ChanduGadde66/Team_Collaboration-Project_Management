const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "border-blue-500",
    text: "text-blue-600",
    icon: "text-blue-500"
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    accent: "border-green-500",
    text: "text-green-600",
    icon: "text-green-500"
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    accent: "border-red-500",
    text: "text-red-600",
    icon: "text-red-500"
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "border-purple-500",
    text: "text-purple-600",
    icon: "text-purple-500"
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    accent: "border-yellow-500",
    text: "text-yellow-600",
    icon: "text-yellow-500"
  },
};

function StatsCard({ title, value, color = "blue", icon }) {
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${colors.bg} p-6 rounded-xl border ${colors.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colors.bg} ${colors.icon}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;