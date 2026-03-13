import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import Button from "../components/Button";

export default function SavingsAccountLesson() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 4;

  // Detect if this is educator or student path
  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Navigate to simulation
      navigate(`${basePath}/course/financial-foundations/simulation/savings`);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 1:
        return (
          <div className="mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 bg-linear-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-6xl">🏛️</span>
              </div>
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Savings Account
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                A savings account is like a safe digital piggy bank at the bank
                where you can store your money and earn a little extra!
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 bg-linear-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-6xl">💰</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Why Use a Savings Account?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Safe & Secure
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Instead of keeping cash in your pocket or under your pillow,
                  banks keep your money safe and protected.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Earn Interest
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The bank pays you a small amount (called interest) for keeping
                  your money with them. It's like getting paid to save!
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 bg-linear-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-6xl">🎯</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Perfect for Emergency Fund
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                This is a great way to build up an{" "}
                <span className="font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  emergency fund
                </span>{" "}
                for surprise situations that might pop up in real life and in
                this game!
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-purple-50 rounded-2xl p-6">
                  <div className="text-3xl mb-3">🚗</div>
                  <h4 className="font-bold text-gray-800 mb-2">Car Repairs</h4>
                  <p className="text-gray-600 text-sm">
                    Unexpected car troubles can be expensive
                  </p>
                </div>

                <div className="bg-purple-50 rounded-2xl p-6">
                  <div className="text-3xl mb-3">🏥</div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Medical Bills
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Health emergencies need quick financial response
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 bg-linear-to-br from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-6xl">⚡</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Key Features
              </h2>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-yellow-100">
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center shrink-0">
                    <span className="text-3xl">💳</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Easy Access
                    </h3>
                    <p className="text-gray-600">
                      You can withdraw your money anytime you need it
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                    <span className="text-3xl">📊</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Low Interest Rate
                    </h3>
                    <p className="text-gray-600">
                      Usually 2-4% per year - safe but modest returns
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100">
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      FDIC Insured
                    </h3>
                    <p className="text-gray-600">
                      Your money is protected up to ₹5,00,000 by the government
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      {/* Pause Indicator */}
      <div className="absolute top-20 left-8 z-10">
        <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">PAUSED</span>
          </div>
          <div className="w-20 h-1 bg-gray-200 rounded-full mt-1">
            <div className="w-1/3 h-1 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Indicators */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-4 shadow-lg border border-gray-100">
            <div className="flex space-x-3">
              {Array.from({ length: totalSlides }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i + 1 === currentSlide
                      ? "bg-blue-600"
                      : i + 1 < currentSlide
                        ? "bg-blue-400"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide Content */}
        <div className="max-w-6xl mx-auto min-h-[500px] flex items-center">
          {renderSlide()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 max-w-6xl mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 1}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-gray-500 text-sm">
              {currentSlide} of {totalSlides}
            </span>
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              {currentSlide === totalSlides ? "Start Simulation! 🎮" : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
