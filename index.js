const mongoose = require("mongoose");

  try {
    await mongoose.connect(
      "mongodb+srv://Wiggels:VCnXtLteYnzKuMBB@guardian.aseufm5.mongodb.net/guardiandb?retryWrites=true&w=majority",
      {
        keepAlive: true,
      }
    );
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userID: { type: String, required: true },
  groupID: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  phone: { type: String, required: true },
  last_updated: { type: String, required: true },
  auth: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

  console.log("Creating a new uniqueID");
  // Generate a random number between 1 and 1000000000
  let uniqueNumber = Math.floor(Math.random() * 1000000000 + 1);

  console.log(`Generated unique number: + ${uniqueNumber}`);

async function createUser(uniqueID) {
  let newUser = new User({
    userID: String(uniqueID),
    groupID: "ad",
    latitude: "ad",
    longitude: "ad",
    phone: "aa",
    last_updated: "ad",
    auth: "ad",
  });

  try {
    let result = await newUser.save();
    console.log("New user created successfully");
  } catch (error) {
    console.error("Error saving new user:", error);
  }
}
