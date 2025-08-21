import {
  MdHome,
  MdAddBox,
  MdMessage,
  MdPeople,
  MdMovieCreation,
  MdMonetizationOn,
  MdExplore,
  MdFavorite,
  MdBookmark,
  MdTrendingUp,
  MdEvent,
  MdGroup,
  MdBusiness,
  MdAnalytics,
  MdSettings,
  MdHelp,
  MdInfo,
  MdSecurity,
  MdPrivacyTip,
  MdFeedback,
  MdWorkspaces,
  MdStorefront,
  MdCampaign,
  MdInsights,
} from "react-icons/md";

// Main Navigation Items (Always visible)
export const primaryItems = [
  { icon: MdHome, label: "Home", path: "/", badge: "2" },
  { icon: MdAddBox, label: "Create", path: "/create" },
  { icon: MdMessage, label: "Messages", path: "/messages", badge: "5" },
  { icon: MdPeople, label: "Friends", path: "/friends" },
  { icon: MdMovieCreation, label: "Reels", path: "/reels" },
  {
    icon: MdFavorite,
    label: "Activity",
    path: "/activity",
    badge: "15", // Combined notifications + suggestions
    responsive: "md-only", // Only show on medium devices
  },
  {
    icon: MdMonetizationOn,
    label: "Monetization",
    path: "/monetization",
    isPro: true,
  },
];

// Professional Features (Collapsible)
export const discoverItems = [
  { icon: MdExplore, label: "Explore", path: "/explore" },
  { icon: MdBookmark, label: "Saved", path: "/saved" },
  { icon: MdTrendingUp, label: "Trending", path: "/trending", isPro: true },
  { icon: MdEvent, label: "Events", path: "/events" },
  { icon: MdGroup, label: "Groups", path: "/groups" },
  { icon: MdBusiness, label: "Business", path: "/business", isPro: true },
  {
    icon: MdWorkspaces,
    label: "Creator Studio",
    path: "/creator-studio",
    isPro: true,
  },
];

// Business & Analytics (Collapsible)
export const businessItems = [
  { icon: MdAnalytics, label: "Analytics", path: "/analytics", isPro: true },
  { icon: MdInsights, label: "Insights", path: "/insights", isPro: true },
  { icon: MdCampaign, label: "Ads Manager", path: "/ads", isPro: true },
  { icon: MdStorefront, label: "Shop", path: "/shop" },
];

// Settings & Support (Collapsible)
export const moreItems = [
  { icon: MdSettings, label: "Settings", path: "/settings" },
  { icon: MdPrivacyTip, label: "Privacy", path: "/privacy" },
  { icon: MdSecurity, label: "Security", path: "/security" },
  { icon: MdHelp, label: "Help Center", path: "/help" },
  { icon: MdFeedback, label: "Feedback", path: "/feedback" },
  { icon: MdInfo, label: "About", path: "/about" },
];

// Navigation sections configuration
export const navigationSections = [
  {
    key: "primary",
    items: primaryItems,
    alwaysVisible: true,
    className: "border-b border-gray-200 pb-4",
  },
  {
    key: "discover",
    title: "Discover",
    items: discoverItems,
    defaultExpanded: true,
  },
  {
    key: "business",
    title: "Business Tools",
    items: businessItems,
    defaultExpanded: false,
  },
  {
    key: "more",
    title: "More",
    items: moreItems,
    defaultExpanded: false,
  },
];
