require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const { getAiAnalysis } = require("./services/analyticsService");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = today;
  
  try {
    console.log("Calling getAiAnalysis...");
    const result = await getAiAnalysis({
      question: "What are the best-selling products?",
      startDate,
      endDate
    });
    console.log("SUCCESS:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}
run();
