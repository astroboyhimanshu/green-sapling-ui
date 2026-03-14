import { useParams, useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import Button from "../components/Button";

interface Level {
  number: number;
  label: string;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  imageSrc: string;
  setupPath: string;
  lessonPath: string;
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  // Level 2 unlocks when navigated here with completedLevel >= 1
  const completedLevel: number =
    (location.state as { completedLevel?: number })?.completedLevel ?? 0;
  const level2Unlocked = completedLevel >= 1;

  const courseData = {
    "financial-foundations": {
      title: "Financial Foundations",
      description:
        "Master the fundamentals of money management, budgeting, and smart financial decisions.",
      icon: "💰",
    },
  };

  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen">
        {isEducator ? <EducatorHeader /> : <StudentHeader />}
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Course Not Found
          </h1>
          <Button onClick={() => navigate(basePath)}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const levels: Level[] = [
    {
      number: 1,
      label: "LEVEL 1",
      title: "Savings Beginner",
      description:
        "Learn how savings accounts work and simulate 5 years of saving money.",
      color: "border-blue-200",
      borderColor: "border-blue-400",
      imageSrc: "/level1.png",
      setupPath: `${basePath}/course/${courseId}/setup`,
      lessonPath: `${basePath}/course/${courseId}/lesson/1`,
    },
    {
      number: 2,
      label: "LEVEL 2",
      title: "Fixed Deposit Explorer",
      description:
        "Discover Fixed Deposits and learn how to grow your money with locked-in interest rates.",
      color: "border-orange-200",
      borderColor: "border-orange-400",
      imageSrc: "/level2.png",
      setupPath: `${basePath}/course/${courseId}/lesson/2`,
      lessonPath: `${basePath}/course/${courseId}/lesson/2`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      <div className="flex p-8 gap-8">
        {/* Left — course info */}
        <div className="w-2/5">
          <div className="bg-white rounded-3xl p-8 border border-green-600 sticky top-8">
            <div className="w-24 h-24 bg-linear-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-5xl mb-6 relative overflow-hidden">
              {course.icon}
              <div className="absolute top-2 right-2 w-5 h-5 bg-white/20 rounded-full" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/20 rounded-full" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {course.title}
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-lg">📚</span>
              <span className="font-medium">2 Levels</span>
            </div>
          </div>
        </div>

        {/* Right — levels list */}
        <div className="flex-1 flex flex-col gap-8">
          {levels.map((level) => {
            const isUnlocked = level.number === 1 || level2Unlocked;
            return (
              <div
                key={level.number}
                className={`bg-white rounded-3xl shadow-sm border-2 overflow-hidden transition-all ${
                  isUnlocked ? level.color : "border-gray-200"
                } ${!isUnlocked ? "opacity-60" : ""}`}
              >
                {/* Level badge */}
                <div
                  className={`px-8 pt-6 pb-2 flex items-center justify-between`}
                >
                  <div>
                    <div
                      className={`text-sm font-semibold mb-1 ${isUnlocked ? "text-blue-600" : "text-gray-400"}`}
                    >
                      {level.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {level.title}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {level.description}
                    </p>
                  </div>
                  {!isUnlocked && <div className="text-4xl ml-4">🔒</div>}
                  {isUnlocked && level.number === 1 && completedLevel >= 1 && (
                    <div className="text-4xl ml-4">✅</div>
                  )}
                </div>

                {/* Level image */}
                <div className="px-8 pb-4">
                  <div
                    className={`aspect-video rounded-2xl overflow-hidden ${!isUnlocked ? "grayscale" : ""}`}
                  >
                    <img
                      src={level.imageSrc}
                      alt={level.title}
                      className="w-full h-full object-cover p-4"
                    />
                  </div>
                </div>

                {/* Action row */}
                <div className="px-8 pb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${isUnlocked ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span className="text-sm text-gray-500">
                      {isUnlocked
                        ? "Ready to start"
                        : "Complete Level 1 to unlock"}
                    </span>
                  </div>
                  <button
                    disabled={!isUnlocked}
                    onClick={() => navigate(level.setupPath)}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      isUnlocked
                        ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {level.number === 1 && completedLevel >= 1
                      ? "Replay Lesson"
                      : "Start Lesson"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
