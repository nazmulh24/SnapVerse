import React, { useState } from "react";
import { MdClose, MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const PhotosTab = ({ userImages, isOwnProfile, fullName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter posts that have images
  const postsWithImages = (userImages || []).filter(
    (post) => post.image && post.image.trim() !== ""
  );

  console.log("PhotosTab - userImages:", userImages);
  console.log("PhotosTab - postsWithImages:", postsWithImages);

  // Helper function to get image URL
  const getImageUrl = (imageUrl) => {
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `https://res.cloudinary.com/dlkq5sjum/${imageUrl}`;
  };

  // Handle image click
  const handleImageClick = (index) => {
    console.log("Image clicked, index:", index); // Debug log
    setSelectedImageIndex(index);
    setIsModalOpen(true);
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
              console.log("Image clicked directly! Index:", index);
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
              console.log("Image failed to load:", post.image);
            }}
          />
        </div>
      ))}
    </div>
  );

  // Render image modal
  const renderImageModal = () => {
    console.log(
      "renderImageModal called - isModalOpen:",
      isModalOpen,
      "selectedImageIndex:",
      selectedImageIndex
    );

    if (!isModalOpen || selectedImageIndex === null) {
      return null;
    }

    const currentPost = postsWithImages[selectedImageIndex];
    if (!currentPost) {
      console.log("No current post found for index:", selectedImageIndex);
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
          console.log("Modal background clicked, closing modal");
          handleCloseModal();
        }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Close button clicked");
            handleCloseModal();
          }}
          style={{ zIndex: 100000 }}
        >
          ✕
        </button>

        {/* Previous button */}
        {hasPrevious && (
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-4xl font-bold bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
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
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-4xl font-bold bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
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
          className="max-w-4xl max-h-4xl mx-4 bg-white p-2 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={getImageUrl(currentPost.image)}
            alt={`Photo by ${fullName}`}
            className="max-w-full max-h-screen object-contain"
            style={{ maxHeight: "80vh" }}
          />

          {/* Image info */}
          {currentPost.content && (
            <div className="bg-gray-800 text-white p-3 mt-2 rounded">
              <p className="text-sm">{currentPost.content}</p>
            </div>
          )}
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold bg-black bg-opacity-50 px-3 py-1 rounded">
          {selectedImageIndex + 1} / {postsWithImages.length}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="px-8 py-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Photos</h3>

        {/* Debug info */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
          <p>Debug: Total userImages: {userImages?.length || 0}</p>
          <p>Debug: Posts with images: {postsWithImages.length}</p>
          <p>Debug: Modal open: {isModalOpen ? "Yes" : "No"}</p>
          <p>Debug: Selected index: {selectedImageIndex}</p>

          {/* Test button */}
          {postsWithImages.length > 0 && (
            <button
              onClick={() => {
                console.log("Test button clicked");
                handleImageClick(0);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
            >
              Test Modal (Click to open first image)
            </button>
          )}
        </div>

        {postsWithImages.length > 0 ? renderPhotoGrid() : renderEmptyState()}
      </div>

      {/* Image Modal */}
      {renderImageModal()}
    </>
  );
};

export default PhotosTab;
