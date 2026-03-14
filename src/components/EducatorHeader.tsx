import { useLocation, useNavigate } from "react-router-dom";
import { getTotalXP } from "../utils/xp";

interface EducatorHeaderProps {
  educatorName?: string;
}

export default function EducatorHeader({
  educatorName = "Educator",
}: EducatorHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const totalXP = getTotalXP();

  const navBtn = (label: string, path: string) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`font-medium transition-colors cursor-pointer px-3 py-2 rounded-lg ${
          active
            ? "bg-green-100 text-green-800"
            : "text-gray-700 hover:text-green-700 hover:bg-green-50"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
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

            <nav className="flex space-x-6">
              {navBtn("🏠 Home", "/educator/dashboard")}
              {navBtn("📚 Courses", "/educator/dashboard")}
              {navBtn("⭐ Progress", "/educator/progress")}
            </nav>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/educator/progress")}
              className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 hover:bg-green-100 transition-colors"
            >
              <span className="text-sm">⭐</span>
              <span className="text-sm font-bold text-green-700">
                {totalXP} XP
              </span>
            </button>
            <div className="hidden sm:block text-right">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="font-semibold text-gray-800">{educatorName}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-semibold text-lg">
                {educatorName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
