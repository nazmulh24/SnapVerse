import React, { useState, useRef } from "react";

const CreatePage = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setImages((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  // Demo backend logic: just simulate a delay and show success
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    // Demo: simulate upload delay
    setTimeout(() => {
      setSuccess(true);
      setContent("");
      setImages([]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
          rows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images (optional):
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ${
              dragActive
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm mb-1">
                Click or drag & drop images here
              </span>
              <span className="text-xs text-gray-500">
                (JPG, PNG, GIF, up to 5 images)
              </span>
            </div>
          </div>
          {images.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-3 mb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx + 1}`}
                      className="h-20 w-20 object-cover rounded border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-xs text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-60"
          disabled={loading || !content.trim()}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
      {success && (
        <div className="mt-4 text-green-600 font-medium">
          Post created successfully! (Demo)
        </div>
      )}
      {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
    </div>
  );
};

export default CreatePage;
