import { useState } from "react";

const PhotosTab = ({ userImages, isOwnProfile, fullName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  // Handle navigation
  const handlePrevious = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex < postsWithImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-8 sm:py-12">
      <div className="text-gray-400 text-base sm:text-lg mb-2">
        No photos yet
      </div>
      <p className="text-gray-500 text-sm sm:text-base px-4">
        {isOwnProfile
          ? "Share some photos to see them here!"
          : `${fullName} hasn't shared any photos yet.`}
      </p>
    </div>
  );

  // Render photo grid
  const renderPhotoGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
      {postsWithImages.map((post, index) => (
        <div
          key={post.id}
          className="aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-200"
          style={{ userSelect: "none" }}
        >
          <img
            src={getImageUrl(post.image)}
            alt={`Photo by ${fullName}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedImageIndex(index);
              setIsModalOpen(true);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            style={{
              cursor: "pointer",
              pointerEvents: "auto",
              display: "block",
            }}
            onError={() => {
              // Handle image load error
            }}
          />
        </div>
      ))}
    </div>
  );

  // Render image modal
  const renderImageModal = () => {
    if (!isModalOpen || selectedImageIndex === null) {
      return null;
    }

    const currentPost = postsWithImages[selectedImageIndex];
    if (!currentPost) {
      return null;
    }

    const hasPrevious = selectedImageIndex > 0;
    const hasNext = selectedImageIndex < postsWithImages.length - 1;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center"
        style={{
          zIndex: 99999,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={() => {
          handleCloseModal();
        }}
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 text-2xl sm:text-3xl font-bold"
          onClick={(e) => {
            e.stopPropagation();
            handleCloseModal();
          }}
          style={{ zIndex: 100000 }}
        >
          ✕
        </button>

        {/* Previous button */}
        {hasPrevious && (
          <button
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl sm:text-4xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            style={{ zIndex: 100000 }}
          >
            ‹
          </button>
        )}

        {/* Next button */}
        {hasNext && (
          <button
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl sm:text-4xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            style={{ zIndex: 100000 }}
          >
            ›
          </button>
        )}

        {/* Image container */}
        <div
          className="max-w-4xl max-h-4xl mx-2 sm:mx-4 bg-white p-1 sm:p-2 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={getImageUrl(currentPost.image)}
            alt={`Photo by ${fullName}`}
            className="max-w-full max-h-screen object-contain"
            style={{ maxHeight: "75vh" }}
          />

          {/* Image info */}
          {currentPost.content && (
            <div className="bg-gray-800 text-white p-2 sm:p-3 mt-1 sm:mt-2 rounded">
              <p className="text-xs sm:text-sm">{currentPost.content}</p>
            </div>
          )}
        </div>

        {/* Image counter */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm sm:text-lg font-bold bg-black bg-opacity-50 px-2 py-1 sm:px-3 sm:py-1 rounded">
          {selectedImageIndex + 1} / {postsWithImages.length}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6">
          Photos
        </h3>

        {postsWithImages.length > 0 ? renderPhotoGrid() : renderEmptyState()}
      </div>

      {/* Image Modal */}
      {renderImageModal()}
    </>
  );
};

export default PhotosTab;
