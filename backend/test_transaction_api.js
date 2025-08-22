const { Transaction, Order, OrderItem, Product, User } = require("./models");

async function testTransactionAPI() {
  try {
    // Import controller
    const {
      getAllTransactions,
      getTransactionStats,
    } = require("./controllers/transactionController");

    // Mock request and response objects
    const req = {};
    const res = {
      json: (data) => {
        console.log("Transaction API Response:", JSON.stringify(data, null, 2));
      },
      status: (code) => ({
        json: (error) => {
          console.log(`Error ${code}:`, error);
        },
      }),
    };

    console.log("Testing getAllTransactions...");
    await getAllTransactions(req, res);

    console.log("\nTesting getTransactionStats...");

    const statsRes = {
      json: (data) => {
        console.log("Stats API Response:", JSON.stringify(data, null, 2));
      },
      status: (code) => ({
        json: (error) => {
          console.log(`Stats Error ${code}:`, error);
        },
      }),
    };

    await getTransactionStats(req, statsRes);

    process.exit(0);
  } catch (error) {
    console.error("Test Error:", error);
    process.exit(1);
  }
}

testTransactionAPI();
