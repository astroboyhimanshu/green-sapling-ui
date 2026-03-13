import StudentHeader from "../components/StudentHeader";
import CourseCard from "../components/CourseCard";

export default function StudentDashboard() {
  // Sample course data - in a real app this would come from an API
  const courses = [
    {
      id: "financial-foundations",
      title: "Financial Foundations",
      description:
        "Master the fundamentals of money management, budgeting, and smart financial decisions. Perfect for beginners starting their financial literacy journey.",
      icon: "💰",
      difficulty: "Beginner" as const,
      lessons: 12,
      isNew: true,
      progress: 0,
      color: "bg-gradient-to-br from-green-400 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader studentName="Alex" />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Learning Paths
          </h1>
          <p className="text-gray-600">
            Step-by-step paths to financial mastery
          </p>
        </div>

        <div className="flex gap-10 py-8">
          <div className="flex w-24 h-24">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-4xl">
              🌱
            </div>
          </div>
          <div className="flex items-center justify-center font-bold text-3xl">
            Foundation of Investing
          </div>
          <div className="flex items-center justify-center text-xl font-medium">
            Learn how to manage your money
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              icon={course.icon}
              difficulty={course.difficulty}
              lessons={course.lessons}
              isNew={course.isNew}
              progress={course.progress}
              color={course.color}
            />
          ))}
        </div>

        {/* Stats Section */}
        {/* <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <p className="text-gray-600">Courses Completed</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <p className="text-gray-600">Lessons Finished</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <p className="text-gray-600">Points Earned</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
