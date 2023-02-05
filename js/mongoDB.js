// Creates a new user with a random number

// function generateUniqueNumber() {
//   console.log("Creating a new uniqueID");
//   // Generate a random number between 1 and 1000000000
//   let uniqueNumber = Math.floor(Math.random() * 1000000000 + 1);

//   console.log(`Generated unique number: + ${uniqueNumber}`);
//   createUser(uniqueNumber);
// }

// async function createUser(uniqueID) {
//   let newUser = new User({
//     userID: String(uniqueID),
//     groupID: "ad",
//     latitude: "ad",
//     longitude: "ad",
//     phone: "aa",
//     last_updated: "ad",
//     auth: "ad",
//   });

//   try {
//     let result = await newUser.save();
//     console.log("New user created successfully");
//   } catch (error) {
//     console.error("Error saving new user:", error);
//   }
// }

// var btn = document.querySelector('startButton');

// // Add click event listener to the button
// btn.addEventListener('click', function() {
//   // Run the function when the button is clicked
//   runFunction();
// });

// // The function to be run when the button is clicked
// function runFunction() {
//   alert('Button was clicked');
// }