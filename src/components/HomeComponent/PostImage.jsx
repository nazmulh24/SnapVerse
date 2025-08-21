import React, { useState } from "react";

const PostImage = ({ src, alt, onDoubleClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  if (imageError || !src) {
    return (
      <div
        className="bg-gray-200 h-80 w-full flex items-center justify-center cursor-pointer"
        onDoubleClick={handleDoubleClick}
      >
        <p className="text-gray-500">Image not available</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 h-80 w-full flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`w-full h-80 object-cover cursor-pointer transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};

export default PostImage;
