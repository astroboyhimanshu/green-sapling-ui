import { Route, Routes } from "react-router-dom";
import RoleSelectionPage from "./RoleSelectionPage";
import StudentDashboard from "./StudentDashboard";
import EducatorDashboard from "./EducatorDashboard";
import LandingPage from "./LandingPage";
import CourseDetail from "./CourseDetail";
import PreCourseForm from "./PreCourseForm";
import SavingsAccountLesson from "./SavingsAccountLesson";
import SavingsSimulation from "./SavingsSimulation";
import FixedDepositLesson from "./FixedDepositLesson";
import FixedDepositSimulation from "./FixedDepositSimulation";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-role" element={<RoleSelectionPage />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/course/:courseId" element={<CourseDetail />} />
      <Route
        path="/student/course/:courseId/setup"
        element={<PreCourseForm />}
      />
      <Route
        path="/student/course/:courseId/lesson/1"
        element={<SavingsAccountLesson />}
      />
      <Route
        path="/student/course/:courseId/simulation/savings"
        element={<SavingsSimulation />}
      />
      <Route
        path="/student/course/:courseId/lesson/2"
        element={<FixedDepositLesson />}
      />
      <Route
        path="/student/course/:courseId/simulation/fixed-deposit"
        element={<FixedDepositSimulation />}
      />
      <Route path="/educator" element={<EducatorDashboard />} />
      <Route path="/educator/course/:courseId" element={<CourseDetail />} />
      <Route
        path="/educator/course/:courseId/setup"
        element={<PreCourseForm />}
      />
      <Route
        path="/educator/course/:courseId/lesson/1"
        element={<SavingsAccountLesson />}
      />
      <Route
        path="/educator/course/:courseId/simulation/savings"
        element={<SavingsSimulation />}
      />
      <Route
        path="/educator/course/:courseId/lesson/2"
        element={<FixedDepositLesson />}
      />
      <Route
        path="/educator/course/:courseId/simulation/fixed-deposit"
        element={<FixedDepositSimulation />}
      />
    </Routes>
  );
};

export default AppRoutes;
