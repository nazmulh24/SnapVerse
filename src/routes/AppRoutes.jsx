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
import CreatePage from "../pages/CreatePage";
import ConnectionPage from "../pages/ConnectionPage";
import MonitizationPage from "../pages/MonitizationPage";
import SavedPage from "../pages/SavedPage";
import TrendingPage from "../pages/TrendingPage";
import BusinessPage from "../pages/BusinessPage";
import CreatorStudioPage from "../pages/CreatorStudioPage";
import AnalyticsPage from "../pages/AnalyticsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/connections" element={<ConnectionPage />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/monetization" element={<MonitizationPage />} />

        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/creator-studio" element={<CreatorStudioPage />} />

        <Route path="/analytics" element={<AnalyticsPage />} />
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
