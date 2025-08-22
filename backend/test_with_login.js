const https = require("https");
const http = require("http");

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https:") ? https : http;
    const req = lib.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testWithLogin() {
  try {
    // First, login to get a valid token
    console.log("Logging in...");
    const loginResponse = await makeRequest(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email: "hilmanfatu@gmail.com",
          password: "hilman123",
        },
      }
    );

    if (loginResponse.status !== 200) {
      throw new Error("Login failed: " + JSON.stringify(loginResponse.data));
    }

    const token = loginResponse.data.token;
    console.log("Login successful, got token");

    // Test transactions endpoint
    console.log("\nTesting transactions API...");
    const transactionsResponse = await makeRequest(
      "http://localhost:5000/api/transactions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Transactions found:", transactionsResponse.data.length);
    if (transactionsResponse.data.length > 0) {
      console.log(
        "First transaction:",
        JSON.stringify(transactionsResponse.data[0], null, 2)
      );
    }

    // Test stats endpoint
    console.log("\nTesting stats API...");
    const statsResponse = await makeRequest(
      "http://localhost:5000/api/transactions/stats",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Stats:", JSON.stringify(statsResponse.data, null, 2));
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testWithLogin();
