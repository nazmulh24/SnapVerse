// Authentication format test
// Paste this in browser console

console.log("=== Authentication Format Test ===");

const token = localStorage.getItem("access_token");
console.log("Raw token:", token?.substring(0, 50) + "...");

async function testAuthFormats() {
  const testAuthHeaders = [
    { Authorization: `JWT ${token}` },
    { Authorization: `Bearer ${token}` },
    { Authorization: `Token ${token}` },
    { Authorization: token },
  ];

  for (let i = 0; i < testAuthHeaders.length; i++) {
    const authHeader = testAuthHeaders[i];
    console.log(
      `\n--- Test ${i + 1}: ${authHeader.Authorization.substring(0, 30)}... ---`
    );

    try {
      // Test with a simple GET request first
      const response = await fetch("http://127.0.0.1:8000/api/v1/posts/7/", {
        headers: authHeader,
      });

      console.log("GET status:", response.status);

      if (response.ok) {
        console.log("✅ Auth format works for GET");

        // Now test POST reaction
        const postResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/posts/7/react/",
          {
            method: "POST",
            headers: {
              ...authHeader,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reaction_type: "like" }),
          }
        );

        console.log("POST status:", postResponse.status);
        const postData = await postResponse.json();
        console.log("POST response:", postData);

        if (postResponse.ok) {
          console.log("🎉 SUCCESS! Auth format and payload work");
          return {
            auth: authHeader,
            status: postResponse.status,
            data: postData,
          };
        }
      } else {
        const errorData = await response.json();
        console.log("GET error:", errorData);
      }
    } catch (error) {
      console.error("Error with auth format:", error);
    }
  }

  return null;
}

testAuthFormats();
