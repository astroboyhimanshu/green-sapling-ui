import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import Button from "../components/Button";

interface FormData {
  grade: string;
  age: number | "";
  name: string;
}

export default function PreCourseForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    grade: "",
    age: "",
    name: "",
  });

  // Detect if this is educator or student path
  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  const totalSteps = isEducator ? 3 : 5; // Educators skip the grade step
  const yearsToAdulthood = isEducator
    ? 5
    : formData.age
      ? 18 - Number(formData.age)
      : 0;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to actual course
      navigate(`${basePath}/course/financial-foundations/lesson/1`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(`${basePath}/course/financial-foundations`);
    }
  };

  const renderStep = () => {
    // For educators, skip grade step and adjust step numbers
    const actualStep =
      isEducator && currentStep >= 2 ? currentStep + 1 : currentStep;

    switch (actualStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌱</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to Financial Foundations!
              </h2>
              <p className="text-xl text-gray-600">
                {isEducator
                  ? "Let's get started with your educator journey"
                  : "Let's get to know you better"}
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 max-w-md mx-auto shadow-xl border border-green-100">
              <label className="block text-gray-700 text-lg font-semibold mb-4">
                What's your name?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-4 rounded-xl text-gray-800 text-lg border-2 border-green-100 focus:border-green-400 focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>
          </div>
        );

      case 2:
        // Skip this step for educators
        if (isEducator) {
          return renderStep3();
        }
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Hi {formData.name}!
              </h2>
              <p className="text-xl text-gray-600">Which grade are you in?</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {["Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setFormData({ ...formData, grade })}
                  className={`p-6 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${
                    formData.grade === grade
                      ? "bg-green-600 text-white shadow-green-200"
                      : "bg-white text-gray-700 hover:bg-green-50 border-2 border-green-100"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return renderStep3();

      case 4:
        return renderStep4();

      case 5:
        return renderStep5();

      default:
        return null;
    }
  };

  const renderStep3 = () => {
    if (isEducator) {
      // For educators, skip age question and go directly to timeline
      return renderStep4();
    }
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🎂</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What's your age?
          </h2>
          <p className="text-xl text-gray-600">
            This helps us customize your learning experience
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 max-w-md mx-auto shadow-xl border border-green-100">
          <input
            type="number"
            min="12"
            max="18"
            value={formData.age}
            onChange={(e) =>
              setFormData({
                ...formData,
                age: e.target.value ? Number(e.target.value) : "",
              })
            }
            className="w-full p-4 rounded-xl text-gray-800 text-2xl text-center border-2 border-green-100 focus:border-green-400 focus:outline-none transition-colors font-semibold"
            placeholder="Your age"
          />
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    return (
      <div className="text-center">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Your Financial Timeline
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-green-100 max-w-2xl mx-auto">
          <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-dashed border-green-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              YEAR 1 OF {yearsToAdulthood}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-linear-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${(1 / yearsToAdulthood) * 100}%` }}
              ></div>
            </div>
            <p className="text-lg text-gray-600">
              Progress through your financial journey
            </p>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <p className="text-2xl text-gray-800 mb-4 font-semibold">
            {isEducator ? (
              <>
                You have{" "}
                <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {yearsToAdulthood} years
                </span>{" "}
                to explore this financial simulation!
              </>
            ) : (
              <>
                You have{" "}
                <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {yearsToAdulthood} years
                </span>{" "}
                to build your wealth!
              </>
            )}
          </p>
          <p className="text-lg text-gray-600">
            The progress bar will advance as you complete lessons and make smart
            financial decisions.
          </p>
        </div>
      </div>
    );
  };

  const renderStep5 = () => {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Your Investment Journey
          </h2>
          <p className="text-xl text-gray-600">
            Here's what awaits you in this course
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">💵</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Regular Income
            </h3>
            <p className="text-lg text-gray-600">
              You will receive{" "}
              <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                ₹5,000
              </span>{" "}
              to invest or save every 6 months
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🔓</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Investment Options
            </h3>
            <p className="text-lg text-gray-600">
              Unlock{" "}
              <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                4 different investment opportunities
              </span>{" "}
              as you progress through each level
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Your Goal</h3>
            <p className="text-lg text-gray-600">
              {isEducator
                ? "Experience the simulation and understand how students learn financial concepts!"
                : "Build the best portfolio and maximize your returns by age 18!"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const canProceed = () => {
    // For educators, adjust step numbers since they skip grade step
    const actualStep =
      isEducator && currentStep >= 2 ? currentStep + 1 : currentStep;

    switch (actualStep) {
      case 1:
        return formData.name.trim() !== "";
      case 2:
        // Students need to select grade, educators skip this
        return isEducator || formData.grade !== "";
      case 3:
        // Students need to enter age, educators skip this
        return (
          isEducator ||
          (formData.age !== "" && formData.age >= 12 && formData.age <= 18)
        );
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-100">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      <div className="container mx-auto px-4 py-12">
        {/* Progress Indicators */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-4 shadow-lg border border-green-100">
            <div className="flex space-x-3">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    i + 1 === currentStep
                      ? "bg-green-600 shadow-lg"
                      : i + 1 < currentStep
                        ? "bg-green-400"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-5xl mx-auto">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 max-w-5xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg border border-gray-200"
          >
            <span>←</span>
            <span>Back</span>
          </button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl px-8 py-3 text-lg font-semibold"
            size="lg"
          >
            {currentStep === totalSteps ? "Start Learning! 🚀" : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
