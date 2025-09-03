// Test to understand post structure and reaction format
// Paste this in browser console

console.log("=== Post Structure Analysis ===");

const token = localStorage.getItem("access_token");

async function analyzePosts() {
  try {
    console.log("Fetching posts...");

    const response = await fetch("http://127.0.0.1:8000/api/v1/posts/", {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    const data = await response.json();
    console.log("Posts response:", data);

    if (data.results && data.results.length > 0) {
      const firstPost = data.results[0];
      console.log("First post structure:", firstPost);
      console.log("Reactions field:", firstPost.reactions);
      console.log("Reactions type:", typeof firstPost.reactions);

      // Look for posts with reactions
      const postsWithReactions = data.results.filter(
        (post) =>
          post.reactions &&
          typeof post.reactions === "object" &&
          Object.keys(post.reactions).length > 0
      );

      if (postsWithReactions.length > 0) {
        console.log("Posts with reactions found:", postsWithReactions.length);
        console.log("Example reactions:", postsWithReactions[0].reactions);
      } else {
        console.log("No posts with reactions found");
      }
    }

    // Also test getting a specific post
    console.log("\n--- Testing specific post ---");
    const postResponse = await fetch("http://127.0.0.1:8000/api/v1/posts/7/", {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    const postData = await postResponse.json();
    console.log("Post 7 data:", postData);
    console.log("Post 7 reactions:", postData.reactions);
  } catch (error) {
    console.error("Error analyzing posts:", error);
  }
}

// Test the API documentation endpoint if available
async function checkApiDocs() {
  try {
    console.log("\n--- Checking API documentation ---");

    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/posts/7/react/",
      {
        method: "OPTIONS",
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );

    console.log("OPTIONS status:", response.status);
    console.log("Allowed methods:", response.headers.get("Allow"));

    // Try to get any response body
    const text = await response.text();
    if (text) {
      console.log("OPTIONS response:", text);
    }
  } catch (error) {
    console.error("Error checking API docs:", error);
  }
}

analyzePosts();
checkApiDocs();
