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

/**
 * Enhanced avatar URL function with local fallback
 * @param {Object} user - User object
 * @param {number} size - Avatar size
 * @returns {string} - Avatar URL
 */
export const getAvatarUrlWithFallback = (user, size = 32) => {
  const avatarUrl = getAvatarUrl(user, size);

  // For local fallback, we'll handle this in the component's onError event
  return avatarUrl;
};

/**
 * Handle avatar loading errors by setting a local fallback
 * @param {Event} event - The error event
 * @param {string} fallbackText - Text for the fallback avatar
 * @param {number} size - Size of the avatar
 */
export const handleAvatarError = (event, fallbackText = "U", size = 64) => {
  event.target.src = generateLocalAvatar(fallbackText, size);
};

export const formatUserName = (user) => {
  if (!user) return "Unknown User";
  return user.full_name || user.username || user.name || "Unknown User";
};

/**
 * Generate a local SVG avatar as fallback when external services fail
 * @param {string} text - The text to display in the avatar
 * @param {number} size - The size of the avatar (default: 64)
 * @param {string} bgColor - Background color (optional)
 * @returns {string} - Data URL for the SVG
 */
export const generateLocalAvatar = (text, size = 64, bgColor = null) => {
  const colors = [
    "#8B5CF6",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#6B7280",
    "#EF4444",
    "#3B82F6",
    "#F97316",
    "#84CC16",
    "#06B6D4",
  ];

  const hash = text.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const color = bgColor || colors[Math.abs(hash) % colors.length];
  const initials = text.charAt(0).toUpperCase();

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="central" 
        text-anchor="middle" 
        fill="white" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.4}" 
        font-weight="500"
      >
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Generate a local placeholder image for general use
 * @param {string} text - The text to display
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 * @returns {string} - Data URL for the SVG
 */
export const generateLocalPlaceholder = (text, width = 400, height = 200) => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="central" 
        text-anchor="middle" 
        fill="#6b7280" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        font-weight="400"
      >
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
