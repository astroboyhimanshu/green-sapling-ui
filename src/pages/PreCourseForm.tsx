import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button as MuiButton } from "@mui/material";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";

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

  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  // Students: name → grade → age → timeline → journey (5 steps)
  // Educators: name → timeline → journey (3 steps)
  const totalSteps = isEducator ? 3 : 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
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

  // Map logical step to actual content step
  // Students:  1=name, 2=grade, 3=age, 4=timeline, 5=journey
  // Educators: 1=name, 2=timeline, 3=journey
  const getContentStep = () => {
    if (isEducator) {
      return [1, 4, 5][currentStep - 1];
    }
    return currentStep;
  };

  const contentStep = getContentStep();

  const canProceed = () => {
    switch (contentStep) {
      case 1:
        return formData.name.trim() !== "";
      case 2:
        return formData.grade !== "";
      case 3:
        return (
          formData.age !== "" &&
          Number(formData.age) >= 12 &&
          Number(formData.age) <= 18
        );
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderContent = () => {
    switch (contentStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌱</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to Financial Foundations!
              </h2>
              <p className="text-xl text-gray-600">Let's get to know you</p>
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
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Hi {formData.name}!
              </h2>
              <p className="text-xl text-gray-600">Which grade are you in?</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {["Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((grade) => (
                <MuiButton
                  key={grade}
                  variant={formData.grade === grade ? "contained" : "outlined"}
                  onClick={() => setFormData({ ...formData, grade })}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "none",
                    ...(formData.grade === grade
                      ? {
                          bgcolor: "#16a34a",
                          "&:hover": { bgcolor: "#15803d" },
                        }
                      : {
                          borderColor: "#bbf7d0",
                          color: "#374151",
                          "&:hover": {
                            bgcolor: "#f0fdf4",
                            borderColor: "#86efac",
                          },
                        }),
                  }}
                >
                  {grade}
                </MuiButton>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎂</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                What's your age?
              </h2>
              <p className="text-xl text-gray-600">
                This helps us personalize your experience
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

      case 4:
        return (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Your Financial Timeline
              </h2>
              <p className="text-xl text-gray-600">
                You have 5 years to grow your wealth in this simulation
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-green-100 max-w-2xl mx-auto">
              <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-dashed border-green-200">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  YEAR 1 OF 5
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className="bg-linear-to-r from-green-400 to-emerald-500 h-4 rounded-full shadow-sm"
                    style={{ width: "20%" }}
                  />
                </div>
                <p className="text-lg text-gray-600">
                  Progress through your financial journey
                </p>
              </div>
            </div>
            <div className="max-w-xl mx-auto">
              <p className="text-2xl text-gray-800 mb-4 font-semibold">
                You have{" "}
                <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  5 years
                </span>{" "}
                to build your wealth!
              </p>
              <p className="text-lg text-gray-600">
                The progress bar advances as you complete lessons and make smart
                financial decisions.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Your Investment Journey
              </h2>
              <p className="text-xl text-gray-600">
                Here's what awaits you in this course
              </p>
            </div>

            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className="flex-1 bg-white rounded-3xl p-6 shadow-xl border border-green-100 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">💵</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Regular Income
                </h3>
                <p className="text-sm text-gray-600">
                  Receive{" "}
                  <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                    ₹5,000
                  </span>{" "}
                  every 6 months to invest or save
                </p>
              </div>

              <div className="flex-1 bg-white rounded-3xl p-6 shadow-xl border border-green-100 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">�</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Investment Options
                </h3>
                <p className="text-sm text-gray-600">
                  Unlock{" "}
                  <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    2 opportunities
                  </span>{" "}
                  as you progress through each level
                </p>
              </div>

              <div className="flex-1 bg-white rounded-3xl p-6 shadow-xl border border-green-100 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Your Goal
                </h3>
                <p className="text-sm text-gray-600">
                  {isEducator
                    ? "Experience the simulation and understand how students learn financial concepts!"
                    : "Build the best portfolio and maximize your returns over 5 years!"}
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
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-100">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      <div className="container mx-auto px-4 py-12">
        {/* Progress dots */}
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

        {/* Content */}
        <div className="max-w-5xl mx-auto">{renderContent()}</div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 max-w-5xl mx-auto">
          <MuiButton
            variant="outlined"
            onClick={handleBack}
            sx={{
              cursor: "pointer",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1.5,
              borderColor: "#d1d5db",
              color: "#4b5563",
              "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" },
            }}
          >
            ← Back
          </MuiButton>

          <MuiButton
            variant="contained"
            onClick={handleNext}
            disabled={!canProceed()}
            sx={{
              cursor: "pointer",
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#15803d" },
              "&:disabled": { opacity: 0.5 },
            }}
          >
            {currentStep === totalSteps ? "Start Learning! 🚀" : "Next →"}
          </MuiButton>
        </div>
      </div>
    </div>
  );
}
