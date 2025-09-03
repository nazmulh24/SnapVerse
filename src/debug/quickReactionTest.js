// Quick reaction test - paste in browser console
// This will help us understand what the backend expects

console.log("=== Quick Reaction Test ===");

const token = localStorage.getItem("access_token");
console.log("Token available:", !!token);

async function quickTest() {
  const testPayloads = [
    // Test 1: Current format
    { reaction_type: "like" },

    // Test 2: Different field name
    { reaction: "like" },

    // Test 3: Different reaction type
    { reaction_type: "love" },

    // Test 4: Check if it's case sensitive
    { reaction_type: "LIKE" },

    // Test 5: Try numeric
    { reaction_type: 1 },

    // Test 6: Empty payload
    {},
  ];

  for (let i = 0; i < testPayloads.length; i++) {
    const payload = testPayloads[i];
    console.log(`\n--- Test ${i + 1}: ${JSON.stringify(payload)} ---`);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/posts/7/react/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Status:", response.status);

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        console.log("✅ SUCCESS!");
        return payload;
      }

      // Wait a bit between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return null;
}

quickTest().then((result) => {
  if (result) {
    console.log("\n🎉 Working payload:", result);
  } else {
    console.log("\n❌ No working payload found");
  }
});
