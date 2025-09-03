// Test script to debug reaction API
// Run this in browser console

console.log("=== Reaction API Debug ===");

// Get token from localStorage
const token = localStorage.getItem("access_token");
console.log("Token exists:", !!token);
console.log("Token length:", token ? token.length : 0);

// Test the reaction API
async function testReactionAPI() {
  const postId = 7;
  const reactionType = "like";

  try {
    console.log("Testing POST reaction API...");

    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/posts/${postId}/react/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          reaction_type: reactionType,
        }),
      }
    );

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (!response.ok) {
      console.error("Error response:", responseData);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

// Also test getting post data to see current reactions
async function getPostData() {
  const postId = 7;

  try {
    console.log("Getting post data...");

    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/posts/${postId}/`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );

    const postData = await response.json();
    console.log("Post data:", postData);
    console.log("Current reactions:", postData.reactions);
  } catch (error) {
    console.error("Error getting post:", error);
  }
}

// Run tests
testReactionAPI();
getPostData();
