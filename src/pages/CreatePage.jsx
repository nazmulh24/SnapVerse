import React, { useState, useRef, useEffect } from "react";
import apiClient from "../services/api-client";

const CreatePage = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const first = files[0];
    if (!first) return;
    console.log("[CreatePage] image selected:", {
      name: first.name,
      size: first.size,
      type: first.type,
    });
    setImages([first]);
  };

  // removed image-remove handler (no preview UI)

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
      const list = Array.from(e.dataTransfer.files);
      const img = list.find((f) => f.type.startsWith("image/"));
      if (!img) return;
      console.log("[CreatePage] image dropped:", {
        name: img.name,
        size: img.size,
        type: img.type,
      });
      setImages([img]);
    }
  };

  // create and cleanup object URL when selected image changes
  useEffect(() => {
    if (images && images[0]) {
      const url = URL.createObjectURL(images[0]);
      setPreviewUrl(url);
      return () => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      };
    }
    setPreviewUrl(null);
    return undefined;
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Build multipart/form-data payload
      const form = new FormData();
      form.append("caption", content || "");
      if (images && images[0]) {
        form.append("image", images[0]);
      }
      form.append("location", location || "");
      form.append("privacy", privacy || "public");

      const tokensRaw = localStorage.getItem("authTokens");
      const access = tokensRaw ? JSON.parse(tokensRaw)?.access : null;
      const headers = access ? { Authorization: `JWT ${access}` } : {};

      // Do NOT set Content-Type header; let the browser set the multipart boundary
      const res = await apiClient.post("/posts/", form, { headers });
      console.log(
        "[CreatePage] server response:",
        res && res.status,
        res && res.data
      );
      if (res && (res.status === 200 || res.status === 201)) {
        setSuccess(true);
        setContent("");
        setImages([]);
        setLocation("");
        setPrivacy("public");
      } else {
        setError("Failed to create post. Server returned unexpected status.");
      }
    } catch (err) {
      console.error("[CreatePage] request error:", err);
      if (err && err.response) {
        try {
          setError(
            typeof err.response.data === "string"
              ? err.response.data
              : JSON.stringify(err.response.data)
          );
        } catch {
          setError(String(err.response.data));
        }
      } else {
        setError(err.message || "Failed to create post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-900 placeholder-gray-500"
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
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center">
              <span className="text-purple-700 font-semibold text-sm mb-1">
                Click or drag & drop images here
              </span>
              <span className="text-xs text-gray-600">
                (JPG, PNG, GIF, single image)
              </span>
            </div>
          </div>

          {/* simple file selected indicator with optional preview */}
          {images.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <div className="text-sm text-gray-700">Selected: {images[0].name}</div>
              {previewUrl && (
                <img src={previewUrl} alt="preview" className="h-16 w-16 object-cover rounded border" />
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location (optional)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location"
            className="w-full border border-gray-300 rounded-lg p-2 mb-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Privacy
          </label>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-900"
          >
            <option value="public">Public</option>
            <option value="followers">Followers Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* no preview per user request; keep minimal summary below */}

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
          Post created successfully!
        </div>
      )}
      {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
    </div>
  );
};

export default CreatePage;
