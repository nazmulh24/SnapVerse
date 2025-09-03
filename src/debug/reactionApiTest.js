// Test utility for reaction API
// Add this to browser console to test reaction API

window.testReactionAPI = async (postId, reactionType = "like") => {
  try {
    const authTokens = localStorage.getItem("authTokens");
    if (!authTokens) {
      console.error("❌ No auth tokens found. Please log in first.");
      return;
    }

    const tokens = JSON.parse(authTokens);

    console.log(
      `🧪 Testing reaction API for post ${postId} with reaction "${reactionType}"`
    );

    // Test adding a reaction
    console.log("📝 Adding reaction...");
    const addResponse = await fetch(
      `http://127.0.0.1:8000/api/v1/posts/${postId}/react/`,
      {
        method: "POST",
        headers: {
          Authorization: `JWT ${tokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reaction_type: reactionType }),
      }
    );

    console.log("🔍 Add Response Status:", addResponse.status);

    if (!addResponse.ok) {
      const errorText = await addResponse.text();
      console.error("❌ Add API Error:", addResponse.status, errorText);
      return;
    }

    const addData = await addResponse.json();
    console.log("✅ Add Reaction Response:", addData);

    // Wait a bit, then test removing the reaction
    setTimeout(async () => {
      console.log("🗑️ Removing reaction...");
      const removeResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/posts/${postId}/react/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${tokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🔍 Remove Response Status:", removeResponse.status);

      if (!removeResponse.ok) {
        const errorText = await removeResponse.text();
        console.error("❌ Remove API Error:", removeResponse.status, errorText);
        return;
      }

      const removeData = await removeResponse.json();
      console.log("✅ Remove Reaction Response:", removeData);
    }, 2000);
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

console.log("🧪 Reaction API test utility loaded!");
console.log("Usage: testReactionAPI(postId, 'like')");
console.log("Available reactions: like, dislike, love, haha, wow, sad, angry");
