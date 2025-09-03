// Comprehensive reaction API test
// Copy and paste this into browser console

console.log("=== Comprehensive Reaction API Test ===");

const token = localStorage.getItem("access_token");
console.log(
  "Using token:",
  token ? token.substring(0, 50) + "..." : "NO TOKEN"
);

async function testDifferentPayloads() {
  const postId = 7;
  const baseUrl = `http://127.0.0.1:8000/api/v1/posts/${postId}/react/`;

  // Test different payload formats
  const testCases = [
    { name: "reaction_type", payload: { reaction_type: "like" } },
    { name: "reaction", payload: { reaction: "like" } },
    { name: "type", payload: { type: "like" } },
    { name: "emotion", payload: { emotion: "like" } },
  ];

  for (const testCase of testCases) {
    console.log(`\n--- Testing payload format: ${testCase.name} ---`);

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(testCase.payload),
      });

      console.log(`Status: ${response.status}`);

      const responseData = await response.json();
      console.log("Response:", responseData);

      if (response.ok) {
        console.log("✅ SUCCESS with payload:", testCase.payload);
        return testCase.payload; // Return successful payload format
      }
    } catch (error) {
      console.error(`Error with ${testCase.name}:`, error);
    }
  }

  return null;
}

// Test getting available reaction types from backend
async function getApiSchema() {
  console.log("\n--- Testing OPTIONS request for API schema ---");

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/posts/7/react/`,
      {
        method: "OPTIONS",
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );

    console.log("OPTIONS status:", response.status);
    console.log("Allowed methods:", response.headers.get("Allow"));

    const data = await response.json();
    console.log("OPTIONS response:", data);
  } catch (error) {
    console.error("OPTIONS error:", error);
  }
}

// Check what other posts look like
async function checkExistingPost() {
  console.log("\n--- Checking existing post structure ---");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/posts/", {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    const posts = await response.json();
    console.log("First post structure:", posts.results?.[0] || posts[0]);

    // Look for a post with existing reactions
    const postWithReactions =
      posts.results?.find(
        (p) => p.reactions && Object.keys(p.reactions).length > 0
      ) ||
      posts.find?.((p) => p.reactions && Object.keys(p.reactions).length > 0);

    if (postWithReactions) {
      console.log("Post with reactions:", postWithReactions.reactions);
    }
  } catch (error) {
    console.error("Error checking posts:", error);
  }
}

// Run all tests
async function runAllTests() {
  await getApiSchema();
  await checkExistingPost();
  const successfulPayload = await testDifferentPayloads();

  if (successfulPayload) {
    console.log("\n🎉 Found working payload format:", successfulPayload);
  } else {
    console.log("\n❌ No payload format worked");
  }
}

runAllTests();
