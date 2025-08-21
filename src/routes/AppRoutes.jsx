import { Routes, Route, Navigate } from "react-router";
import MainLayout from "../components/layouts/MainLayout";
import Home from "../pages/Home";
import ActivityPage from "../pages/ActivityPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/activity" element={<ActivityPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Protected Routes */}
      {/* Here comes Protected Routes Later... */}
    </Routes>
  );
};

export default AppRoutes;
