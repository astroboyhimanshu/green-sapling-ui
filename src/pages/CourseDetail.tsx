import { useParams, useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import Button from "../components/Button";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if this is educator or student path
  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  // Sample course data - in a real app this would be fetched based on courseId
  const courseData = {
    "financial-foundations": {
      title: "Financial Foundations",
      description:
        "Master the fundamentals of money management, budgeting, and smart financial decisions.",
      icon: "💰",
      difficulty: "Beginner",
      lessons: 12,
      duration: "4 weeks",
      color: "bg-gradient-to-br from-green-400 to-emerald-500",
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

  return (
    <div className="min-h-screen">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      <div className="flex p-8">
        {/* Course details */}
        <div className="flex w-1/2 p-4">
          <div className="flex flex-col w-4/5 bg-white rounded-3xl p-8 border border-green-600 h-fit">
            {/* Course Icon */}
            <div className="mb-6">
              <div className="w-32 h-32 bg-linear-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-6xl relative overflow-hidden">
                {course.icon}
                {/* Background decorative elements */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/10 rounded-full"></div>
              </div>
            </div>

            {/* Course Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>

            {/* Course Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {course.description}
            </p>

            {/* Course Stats */}
            <div className="flex items-center space-x-8 text-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm">📚</span>
                </div>
                <span className="font-medium">{course.lessons} Lessons</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm">🎯</span>
                </div>
                <span className="font-medium">24 Exercises</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/5"></div>
        </div>

        {/* Course Levels */}
        <div className="flex flex-col w-1/2 p-4">
          {/* Level Header */}
          <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-blue-200 shadow-sm">
            <div className="text-center">
              <div className="text-blue-600 font-medium text-lg mb-2">
                LEVEL 1
              </div>
              <div className="font-bold text-3xl text-gray-900">
                Savings Beginner
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
              {/* Placeholder for video - replace with actual video when available */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mb-4 mx-auto transform rotate-45">
                  <div className="w-8 h-8 bg-white rounded-sm transform -rotate-45"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Finding Half
                </h3>
                <p className="text-gray-600">Interactive lesson coming soon</p>
              </div>

              {/* Uncomment when video is available */}
              {/* <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              >
                <source src="/sapling_level1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video> */}
            </div>

            {/* Video Controls/Info */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Ready to start</span>
              </div>
              <button
                onClick={() =>
                  navigate(`${basePath}/course/financial-foundations/setup`)
                }
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
              >
                Start Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
