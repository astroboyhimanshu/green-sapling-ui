import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress?: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  isNew?: boolean;
  color: string;
  basePath?: string;
}

export default function CourseCard({
  id,
  title,
  description,
  icon,
  progress = 0,
  difficulty,
  lessons,
  isNew = false,
  color,
  basePath = "/student",
}: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group"
      onClick={() => navigate(`${basePath}/course/${id}`)}
    >
      {/* New Badge */}
      {isNew && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </span>
        </div>
      )}

      {/* Course Icon/Illustration */}
      <div
        className={`${color} p-8 flex items-center justify-center relative overflow-hidden`}
      >
        <div className="text-6xl mb-2 relative z-10">{icon}</div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
            {title}
          </h3>
        </div>

        {/* Course Meta */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              difficulty === "Beginner"
                ? "bg-green-100 text-green-700"
                : difficulty === "Intermediate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {difficulty}
          </span>
          <span className="text-xs text-gray-500">{lessons} lessons</span>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-gray-100 cursor-pointer hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 group-hover:bg-green-50 group-hover:text-green-700">
          {progress > 0 ? "Continue Learning" : "Start Course"}
        </button>
      </div>
    </div>
  );
}
