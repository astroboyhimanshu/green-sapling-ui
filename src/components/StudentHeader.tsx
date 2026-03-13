import { useNavigate } from "react-router-dom";

interface StudentHeaderProps {
  studentName?: string;
}

export default function StudentHeader({
  studentName = "Student",
}: StudentHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold text-green-800">
                Green Sapling
              </span>
            </div>

            <nav className="hidden md:flex space-x-6">
              <button className="text-green-700 font-medium border-b-2 border-green-700 relative z-10 cursor-pointer">
                Courses
              </button>
              <button className="text-gray-600 hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-700 -mb-0.5 relative z-10 cursor-pointer">
                Progress
              </button>
              <button className="text-gray-600 hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-700 -mb-0.5 relative z-10 cursor-pointer">
                Achievements
              </button>
            </nav>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-800">{studentName}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-semibold">
                {studentName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
