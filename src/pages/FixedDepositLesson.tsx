import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import Button from "../components/Button";

export default function FixedDepositLesson() {
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
      navigate(
        `${basePath}/course/financial-foundations/simulation/fixed-deposit`,
      );
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
              <div className="w-32 h-32 bg-linear-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-6xl">📜</span>
              </div>
              <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">
                Fixed Deposit (FD)
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                A Fixed Deposit is a popular investment scheme offered by banks
                in India where you deposit money for a fixed period and earn
                guaranteed higher interest!
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-6xl">🔒</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                How Fixed Deposits Work
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⏰</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Fixed Time Period
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  You choose how long to keep your money locked: 1 year, 3
                  years, or 5 years. You cannot withdraw before this time!
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Higher Interest
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Because your money is locked, banks pay you more interest than
                  savings accounts - usually 5-8% per year!
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 bg-linear-to-br from-green-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-6xl">⚖️</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                FD vs Savings Account
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">
                    Fixed Deposit
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Higher interest (5-8%)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Guaranteed returns</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Money locked for fixed time</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>No emergency access</span>
                    </div>
                  </div>
                </div>

                <div className="mx-auto">
                  <h3 className="text-2xl font-bold text-green-600 mb-4">
                    Savings Account
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Access money anytime</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Perfect for emergencies</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Lower interest (3-4%)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Less growth potential</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 bg-linear-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-6xl">🎯</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                Smart Strategy
              </h2>
            </div>

            <div className="flex gap-6 max-w-4xl mx-auto">
              <div className="flex-1 bg-white rounded-3xl p-8 shadow-xl border border-purple-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Use Both!
                </h3>
                <p className="text-gray-600 text-sm">
                  Keep some money in savings for emergencies and put extra money
                  in FDs for better growth
                </p>
              </div>

              <div className="flex-1 bg-white rounded-3xl p-8 shadow-xl border border-orange-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Choose Wisely
                </h3>
                <p className="text-gray-600 text-sm">
                  Longer FDs = Higher interest, but your money is locked longer.
                  Think about when you might need it!
                </p>
              </div>

              <div className="flex-1 bg-linear-to-br from-green-100 to-blue-100 rounded-3xl p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Ready to Try Both?
                </h3>
                <p className="text-gray-600 text-sm">
                  In the next simulation, manage both a Savings Account and
                  Fixed Deposits. Balance accessibility with growth!
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-red-50 to-purple-50 flex flex-col">
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

      <div className="flex-1 flex flex-col container mx-auto px-4 py-12">
        {/* Progress dots */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-4 shadow-lg border border-gray-100">
            <div className="flex space-x-3">
              {Array.from({ length: totalSlides }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i + 1 === currentSlide
                      ? "bg-orange-600"
                      : i + 1 < currentSlide
                        ? "bg-orange-400"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide content */}
        <div className="flex-1 max-w-6xl mx-auto w-full flex items-center justify-center">
          {renderSlide()}
        </div>

        {/* Navigation — pinned at bottom, same position every slide */}
        <div className="flex justify-between items-center mt-12 max-w-6xl mx-auto w-full">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 1}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-8 py-3 text-lg font-semibold"
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
