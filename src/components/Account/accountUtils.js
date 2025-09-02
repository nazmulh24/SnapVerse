import {
  MdExplore,
  MdBusiness,
  MdSettings,
  MdHelp,
  MdSecurity,
  MdPrivacyTip,
  MdAnalytics,
  MdCampaign,
  MdStore,
  MdPeople,
  MdTrendingUp,
  MdLanguage,
  MdPerson,
} from "react-icons/md";

// Navigation items for different sections
export const discoverItems = [
  { icon: MdExplore, label: "Explore", href: "/explore" },
  { icon: MdTrendingUp, label: "Trending", href: "/trending" },
  { icon: MdPeople, label: "Suggested People", href: "/connections" },
  { icon: MdLanguage, label: "Find Friends", href: "/find-friends" },
];

export const businessItems = [
  { icon: MdBusiness, label: "Business", href: "/business" },
  { icon: MdAnalytics, label: "Analytics", href: "/analytics" },
  { icon: MdCampaign, label: "Ads Manager", href: "/ads-manager" },
  { icon: MdStore, label: "Shop", href: "/shop" },
];

export const settingsItems = [
  { icon: MdSettings, label: "Settings", href: "/settings" },
  { icon: MdSecurity, label: "Security", href: "/security" },
  { icon: MdPrivacyTip, label: "Privacy", href: "/privacy" },
  { icon: MdHelp, label: "Help Center", href: "/help-center" },
];

export const tabs = [
  { id: "profile", label: "Profile", icon: MdPerson },
  { id: "discover", label: "Discover", icon: MdExplore },
  { id: "business", label: "Business Tools", icon: MdBusiness },
  { id: "settings", label: "Settings & Support", icon: MdSettings },
];

// Utility functions for profile data
export const getAvatarUrl = (user) => {
  if (!user)
    return `https://ui-avatars.com/api/?name=User&background=random&color=fff`;

  const profilePicture = user.profile_picture || user.avatar || user.image;

  if (profilePicture) {
    if (profilePicture.startsWith("http")) {
      return profilePicture;
    } else if (profilePicture.startsWith("image/upload/")) {
      return `https://res.cloudinary.com/dlkq5sjum/${profilePicture}`;
    } else {
      return `https://res.cloudinary.com/dlkq5sjum/image/upload/${profilePicture}`;
    }
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.full_name || user.username || user.first_name || "User"
  )}&background=6366f1&color=fff&size=200`;
};

export const getCoverPhotoUrl = (user) => {
  const coverPhoto = user?.cover_photo || user?.cover_picture;

  if (coverPhoto) {
    if (coverPhoto.startsWith("http")) {
      return coverPhoto;
    } else if (coverPhoto.startsWith("image/upload/")) {
      return `https://res.cloudinary.com/dlkq5sjum/${coverPhoto}`;
    } else {
      return `https://res.cloudinary.com/dlkq5sjum/image/upload/${coverPhoto}`;
    }
  }

  // Default gradient cover
  return null;
};
