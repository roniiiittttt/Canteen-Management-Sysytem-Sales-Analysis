const mongoose = require("mongoose");

const uri =
  "mongodb+srv://canteenadmin:Ronit123456@cluster0.81fbvx3.mongodb.net/?appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected");
  })
  .catch((err) => {
    console.log("FULL ERROR:");
    console.dir(err, { depth: null });
  });