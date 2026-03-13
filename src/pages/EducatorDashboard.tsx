import EducatorHeader from "../components/EducatorHeader";
import CourseCard from "../components/CourseCard";

export default function EducatorDashboard() {
  // Same course data as students - educators get access to the same content
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
      <EducatorHeader educatorName="Teacher" />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Course Library
          </h1>
          <p className="text-gray-600">
            Explore and teach financial literacy courses to your students
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
            Teach students how to manage their money
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
              basePath="/educator"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
