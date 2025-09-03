/**
 * Utility functions for handling user avatars
 */

export const getAvatarUrl = (user, size = 32) => {
  console.log("🖼️ getAvatarUrl called with user:", user, "size:", size);

  if (!user) {
    console.log("🖼️ No user provided, using default avatar");
    return `https://ui-avatars.com/api/?name=Unknown%20User&background=random&color=fff&size=${size}`;
  }

  // If user has a profile picture
  if (user.profile_picture) {
    console.log("🖼️ User has profile_picture:", user.profile_picture);

    // If it's already a full URL, return as-is
    if (user.profile_picture.startsWith("http")) {
      console.log("🖼️ Profile picture is full URL, using as-is");
      return user.profile_picture;
    }

    // If it starts with 'image/upload/', add cloudinary base URL
    if (user.profile_picture.startsWith("image/upload/")) {
      const url = `https://res.cloudinary.com/dlkq5sjum/${user.profile_picture}`;
      console.log("🖼️ Profile picture is cloudinary path, built URL:", url);
      return url;
    }

    // Otherwise, assume it's just a filename and add full cloudinary path
    const url = `https://res.cloudinary.com/dlkq5sjum/image/upload/${user.profile_picture}`;
    console.log("🖼️ Profile picture is filename, built URL:", url);
    return url;
  }

  // Fallback to generated avatar using user's name
  const name = user.full_name || user.username || user.name || "User";
  const encodedName = encodeURIComponent(name);

  const url = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=${size}`;
  console.log("🖼️ Using generated avatar for name:", name, "URL:", url);

  return url;
};

export const formatUserName = (user) => {
  if (!user) return "Unknown User";
  return user.full_name || user.username || user.name || "Unknown User";
};
