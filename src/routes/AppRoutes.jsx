import { Routes, Route } from "react-router";
import MainLayout from "../components/layouts/MainLayout";
import PrivateRoute from "../components/PrivateRoute";
import Home from "../pages/Home";
import MessagesPage from "../pages/MessagesPage";
import CreatePage from "../pages/CreatePage";
import ConnectionPage from "../pages/ConnectionPage";
import ReelsPage from "../pages/ReelsPage";
import MonetizationPage from "../pages/MonetizationPage";
import ExplorePage from "../pages/ExplorePage";
import SavedPage from "../pages/SavedPage";
import TrendingPage from "../pages/TrendingPage";
import EventsPage from "../pages/EventsPage";
import GroupsPage from "../pages/GroupsPage";
import BusinessPage from "../pages/BusinessPage";
import CreatorStudioPage from "../pages/CreatorStudioPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import InsightsPage from "../pages/InsightsPage";
import AdsManagerPage from "../pages/AdsManagerPage";
import ShopPage from "../pages/ShopPage";
import SettingsPage from "../pages/SettingsPage";
import PrivacyPage from "../pages/PrivacyPage";
import SecurityPage from "../pages/SecurityPage";
import HelpCenterPage from "../pages/HelpCenterPage";
import FeedbackPage from "../pages/FeedbackPage";
import AboutPage from "../pages/AboutPage";
import ActivityPage from "../pages/ActivityPage";
import AccountPage from "../pages/AccountPage";
import UserProfile from "../pages/UserProfile";
import EditProfile from "../pages/EditProfile";

import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Only Login/Register accessible without authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Routes - All other routes require authentication */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/connections" element={<ConnectionPage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/monetization" element={<MonetizationPage />} />

          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/creator-studio" element={<CreatorStudioPage />} />

          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/ads" element={<AdsManagerPage />} />
          <Route path="/shop" element={<ShopPage />} />

          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
