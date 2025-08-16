const fetch = require("node-fetch");

async function testApprovalEndpoint() {
  try {
    console.log("🧪 Testing approval endpoint directly...");

    // Test approval untuk payment ID 11
    const response = await fetch(
      "http://localhost:5000/api/payments/11/approve",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Admin token would be needed here in real scenario
        },
        body: JSON.stringify({
          admin_notes: "Test approval via API",
        }),
      }
    );

    const result = await response.json();

    console.log("📊 API Response:", {
      status: response.status,
      ok: response.ok,
      data: result,
    });

    if (response.ok) {
      console.log("✅ Approval successful!");
      if (result.stockUpdates) {
        console.log("📦 Stock updates:", result.stockUpdates);
      }
    } else {
      console.log("❌ Approval failed:", result.message);
    }
  } catch (error) {
    console.error("❌ Error testing endpoint:", error.message);
  }
}

testApprovalEndpoint();
