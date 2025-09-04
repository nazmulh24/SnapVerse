import React from "react";

const PhotosTab = ({ userImages, isOwnProfile, fullName }) => {
  // Filter posts that have images
  const postsWithImages = (userImages || []).filter(
    (post) => post.image && post.image.trim() !== ""
  );

  // Helper function to get image URL
  const getImageUrl = (imageUrl) => {
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `https://res.cloudinary.com/dlkq5sjum/${imageUrl}`;
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-lg mb-2">No photos yet</div>
      <p className="text-gray-500">
        {isOwnProfile
          ? "Share some photos to see them here!"
          : `${fullName} hasn't shared any photos yet.`}
      </p>
    </div>
  );

  // Render photo grid
  const renderPhotoGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {postsWithImages.map((post) => (
        <div key={post.id} className="aspect-square rounded-lg overflow-hidden">
          <img
            src={getImageUrl(post.image)}
            alt={`Photo by ${fullName}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="px-8 py-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Photos</h3>
      {postsWithImages.length > 0 ? renderPhotoGrid() : renderEmptyState()}
    </div>
  );
};

export default PhotosTab;
