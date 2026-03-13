import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-green-800 mb-4">
              🌱 Green Sapling
            </h1>
            <h2 className="text-3xl font-semibold text-green-700 mb-2">
              Choose Your Path
            </h2>
            <p className="text-gray-600 text-lg">
              Select your role to begin your financial literacy journey
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Student Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="text-6xl mb-6">🎓</div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Students
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Grades 7-10 students ready to learn about money, investing,
                  and building a strong financial future through interactive
                  games and challenges.
                </p>
                <ul className="text-left text-sm text-gray-600 mb-8 space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-0.5">✓</span>
                    Interactive learning modules and simulations
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-0.5">✓</span>
                    Gamified challenges with points and rewards
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-0.5">✓</span>
                    Track your progress and achievements
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-0.5">✓</span>
                    Age-appropriate financial content
                  </li>
                </ul>
                <Button
                  onClick={() => navigate("/student")}
                  className="w-full"
                  size="lg"
                >
                  Start as Student
                </Button>
              </div>
            </div>

            {/* Parents/Teachers Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="text-6xl mb-6">👨‍🏫</div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Parents & Teachers
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Educators and parents looking to guide young learners through
                  financial literacy concepts and monitor their progress.
                </p>
                <ul className="text-left text-sm text-gray-600 mb-8 space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-0.5">✓</span>
                    Monitor student progress and performance
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-0.5">✓</span>
                    Access comprehensive teaching resources
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-0.5">✓</span>
                    Customize learning paths for students
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-0.5">✓</span>
                    Generate detailed progress reports
                  </li>
                </ul>
                <Button
                  onClick={() => navigate("/educator")}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  Start as Educator
                </Button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="text-green-700 hover:text-green-800 font-medium text-lg transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
