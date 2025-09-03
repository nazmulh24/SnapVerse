// Temporary debug utility to test comment API
// Add this to browser console to test comment API

window.testCommentAPI = async (postId) => {
  try {
    const authTokens = localStorage.getItem("authTokens");
    if (!authTokens) {
      console.error("❌ No auth tokens found. Please log in first.");
      return;
    }

    const tokens = JSON.parse(authTokens);
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/posts/${postId}/comments/`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🔍 API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ API Response Data:", data);
    console.log("📊 Data type:", typeof data);
    console.log("🔢 Is array:", Array.isArray(data));

    if (data.results) {
      console.log("📋 Results array:", data.results);
      console.log("📈 Results count:", data.results.length);

      if (data.results.length > 0) {
        console.log("📝 First comment sample:", data.results[0]);
        console.log(
          "👤 First comment user:",
          data.results[0].user || data.results[0].author
        );
      }
    }

    return data;
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Usage: testCommentAPI(22) - replace 22 with actual post ID
console.log("🧪 Comment API test function loaded. Use: testCommentAPI(postId)");
