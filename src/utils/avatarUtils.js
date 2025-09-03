/**
 * Utility functions for handling user avatars
 */

export const getAvatarUrl = (user, size = 32) => {
  if (!user) {
    return `https://ui-avatars.com/api/?name=Unknown%20User&background=random&color=fff&size=${size}`;
  }

  // If user has a profile picture
  if (user.profile_picture) {
    // If it's already a full URL, return as-is
    if (user.profile_picture.startsWith("http")) {
      return user.profile_picture;
    }

    // If it starts with 'image/upload/', add cloudinary base URL
    if (user.profile_picture.startsWith("image/upload/")) {
      return `https://res.cloudinary.com/dlkq5sjum/${user.profile_picture}`;
    }

    // Otherwise, assume it's just a filename and add full cloudinary path
    return `https://res.cloudinary.com/dlkq5sjum/image/upload/${user.profile_picture}`;
  }

  // Fallback to generated avatar using user's name
  const name = encodeURIComponent(
    user.full_name || user.username || user.name || "User"
  );

  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=${size}`;
};

export const formatUserName = (user) => {
  if (!user) return "Unknown User";
  return user.full_name || user.username || user.name || "Unknown User";
};
