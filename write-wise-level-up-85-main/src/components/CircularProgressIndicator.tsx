
interface CircularProgressIndicatorProps {
  percentage: number;
}

export const CircularProgressIndicator = ({ percentage }: CircularProgressIndicatorProps) => {
  const circleSize = 200;
  const strokeWidth = 16;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={circleSize}
        height={circleSize}
      >
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        <circle
          className="text-emerald-400"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
      </svg>
      <div className="absolute text-4xl font-bold">
        {percentage}%
      </div>
    </div>
  );
};
