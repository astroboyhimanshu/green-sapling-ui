import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FeatureCard from "../components/FeatureCard";
import Button from "../components/Button";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "💰",
      title: "Money Management",
      description:
        "Learn budgeting, saving strategies, and smart spending habits through interactive simulations.",
    },
    {
      icon: "📈",
      title: "Investing Basics",
      description:
        "Understand stocks, bonds, portfolios, and risk management in age-appropriate ways.",
    },
    {
      icon: "🎮",
      title: "Gamified Learning",
      description:
        "Earn points, unlock achievements, and compete with friends while learning financial concepts.",
    },
    {
      icon: "🏆",
      title: "Progress Tracking",
      description:
        "Monitor your financial literacy journey with detailed progress reports and milestones.",
    },
    {
      icon: "👥",
      title: "Collaborative Learning",
      description:
        "Work together with classmates and get guidance from teachers and parents.",
    },
    {
      icon: "🌱",
      title: "Real-World Skills",
      description:
        "Apply financial concepts to real-life scenarios and build practical money skills.",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-7xl font-bold text-green-800 mb-4">
                Green Sapling
              </h1>
              <p className="text-3xl text-green-700 font-mediu                                                                                                                                                                                                                                             m mb-6">
                Grow Your Financial Future
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Where financial education meets gamification! Our interactive
                platform teaches students (grades 7-10), teachers, and parents
                about investing, money management, and financial literacy
                through engaging, game-based learning experiences.
              </p>
            </div>

            <div className="mb-12">
              <Button
                onClick={() => navigate("/select-role")}
                size="lg"
                className="rounded-full px-12 cursor-pointer"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
              Why Choose Green Sapling?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Building Financial Confidence
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  7-10
                </div>
                <p className="text-gray-600">Grade Levels</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  100%
                </div>
                <p className="text-gray-600">Interactive Learning</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">∞</div>
                <p className="text-gray-600">Growth Potential</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-green-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students, teachers, and parents building
              financial literacy together.
            </p>
            <Button
              onClick={() => navigate("/select-role")}
              variant="outline"
              size="lg"
              className="bg-white text-green-600 border-white hover:bg-gray-100 hover:text-green-700"
            >
              Choose Your Path
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <p className="text-green-700 text-lg font-medium">
              Building financial confidence, one sapling at a time 🌳
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
