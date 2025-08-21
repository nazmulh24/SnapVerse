import { Routes, Route, Navigate } from "react-router";
import MainLayout from "../components/layouts/MainLayout";
import Home from "../pages/Home";
import ActivityPage from "../pages/ActivityPage";
import AccountPage from "../pages/AccountPage";
import MessagesPage from "../pages/MessagesPage";
import ReelsPage from "../pages/ReelsPage";
import ExplorePage from "../pages/ExplorePage";
import EventsPage from "../pages/EventsPage";
import GroupsPage from "../pages/GroupsPage";
import ShopPage from "../pages/ShopPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/account" element={<AccountPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Protected Routes */}
      {/* Here comes Protected Routes Later... */}
    </Routes>
  );
};

export default AppRoutes;
