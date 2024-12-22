const { totalmem } = require("os");
const { db } = require("../firebase.js");
const { ref, set } = require("firebase/database");

const populateDatabase = async () => {
  try {
    // Reference to the "data" node
    const appDataRef = ref(db, "data");

    // Data to populate the "data" node
    const appData = {
      users: {
        john_doe_account: {
          role: "person_in_need",
          name: "John Doe",
          password: "person_password123",
          dob: "1990-01-01",
          phone: "+1234567890",
          address: "123 Main Street, City",
          dietary_needs: "Vegetarian",
          mobility_issues: "Yes"
        },
        helping_hands_account: {
          role: "organization",
          organization_name: "Helping Hands",
          password: "securepassword123",
          representative: {
            name: "Alice Johnson",
            designation: "Manager",
            dob: "1980-05-10",
            email: "alice.johnson@example.com",
            phone: "+1122334455"
          },
          addresses: ["123 Charity Lane, City A, Singapore 123456", "456 Donation Drive, City B, Singapore 123456"],
          about: "We provide food and shelter for those in need."
        },
        abc_supermarket: {
          role: "food_stall",
          organization_name: "ABC Supermarket",
          password: "mypassword123",
          representative: {
            name: "Emily Stone",
            designation: "Owner",
            dob: "1985-11-25",
            email: "emily.stone@example.com",
            phone: "+2233445566"
          },
          about: "We provide fresh produce and groceries.",
          location: "789 Market Street, City C"
        },
        charlie_brown_account: {
          role: "volunteer",
          name: "Charlie Brown",
          password: "volunteerpassword123",
          image: "https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg",
          dob: "1992-06-15",
          email: "charlie.brown@example.com",
          phone: "+3344556677"
        }
      },
      announcements: {
        food: {
          1: {
          createdBy: "helping_hands_account", // Updated to reference the unique account_name
          image: "https://offerengine.theentertainerme.com/dunkin-donuts---singapore-x096491/merchant_profile_%22hero%22_image_%28retina%29202409161711.jpg",
          store: "Dunkin' Donuts",
          title: "Extra Dunkin' Donuts!!!",
          date: "22 December 2024",
          description: "We have leftover donuts that will expire tonight. Available for pickup from 8 PM to 10 PM.",
          quantityLeft: 5,
          totalQuantity: 10,
          time: "2000 - 2200",
          location: "123 Charity Lane, City A",
          timestamp: new Date().toISOString()
          },
          2: {
            createdBy: "abc_supermarket", // Updated to reference the unique account_name
            image: "https://static.toiimg.com/thumb/81673781.cms?resizemode=4&width=1200",
            store: "BreadTalk",
            title: "Free Bread and Pastries from BreadTalk!",
            date: "22 December 2024",
            description: "We have 30 excess bread and pastries that need to be given away. Please visit before closing at 9 PM.",
            quantityLeft: 20,
            totalQuantity: 30,  
            time: "Before 2100",
            location: "789 Market Street, City C",
            timestamp: new Date().toISOString()
          }
        },
        clothes: {
          1: {
            createdBy: "charlie_brown_account", // Updated to reference the unique account_name
            image: "https://th.bing.com/th/id/OIP.3wNFmT0u9OI6h9jf9YjxyAHaFj?rs=1&pid=ImgDetMain",
            store: null,
            title: "Free Clothes for All!",
            description: "We have a variety of clothes available for free distribution. Come and pick your favorites!",
            quantityLeft: 5,
            totalQuantity: 10,
            date: "23 December 2024",
            time: "1000 - 1800",
            location: "Sengkang Drive Block 123, #01-01, Singapore 123456",
            timestamp: new Date().toISOString()
          },
          2: {
            createdBy: "helping_hands_account", // Updated to reference the unique account_name
            image: "https://th.bing.com/th/id/OIP.Yq3fgpjpo3oMbQQMoK7orAHaEK?w=750&h=422&rs=1&pid=ImgDetMain",
            title: "Giving out free clothes for Christmas!",
            description: "We have a variety of clothes available for free distribution. Merry Christmas, hohoho. Come and pick your favorites!",
            quantityLeft: 20, 
            totalQuantity: 30,
            date: "24 December 2024",
            time: "1500 - 2000",
            location: "456 Donation Drive, City B, Singapore 123456",
            timestamp: new Date().toISOString()
          }
        }
      },
      specialRequests: { // can be created through a form that they input and submit.
        1: {
          createdBy: "john_doe_account", // Updated to reference the unique account_name
          type: "transport",
          details: "Need a volunteer to help me reach the healthcare center for a checkup.",
          date: "26 December 2024",
          time: "0900 - 1000",
          location: "123 Main Street, City",
          status: "pending", // Can be "pending", "in-progress", or "completed"
          timestamp: new Date().toISOString()
        },
        2: {
          createdBy: "john_doe_account", // Updated to reference the unique account_name
          type: "furniture",
          details: "Need help moving a heavy table to another room.",
          date: "27 December 2024",
          time: "0000 - 2359",
          location: "123 Main Street, City",
          status: "pending",
          timestamp: new Date().toISOString()
        }
      },
      foodRequests: { // created when "I want this one!" is clicked, automatic.
        1: {
          createdBy: "john_doe_account", // Updated to reference the unique account_name
          details: "Need help collecting food please!",
          foodID: 1, // Updated to reference the unique food announcement ID
          date: new Date().toISOString(), // as of the time they submit the request to get the food
          time: new Date().toLocaleTimeString(), // as of the time they submit the request to get the food
          location: "123 Main Street, City",
          status: "pending", // Can be "pending", "in-progress", or "completed"
          timestamp: new Date().toISOString()
        },
        2: {
          createdBy: "john_doe_account", // Updated to reference the unique account_name
          details: "Need help collecting food please!",
          foodID: 2, 
          date: new Date().toISOString(), // as of the time they submit the request to get the food
          time: new Date().toLocaleTimeString(), // as of the time they submit the request to get the food
          location: "123 Main Street, City",
          status: "pending",
          timestamp: new Date().toISOString()
        }
      }
    };

    // Set the data in the "data" node
    await set(appDataRef, appData);

    console.log("Database populated successfully under 'data' node!");
  } catch (error) {
    console.error("Error populating the database:", error.message);
  }
};

// Run the function
populateDatabase();
 
// To overwrite database instead of updating

// const { db } = require("./firebase.js");
// const { ref, set } = require("firebase/database");

// const overwriteDatabase = async () => {
//   const newData = {
//     users: {
//       user1: {
//         name: "Alice Johnson",
//         email: "alice@example.com",
//         phone: "+1234567899"
//       },
//       user2: {
//         name: "Bob Williams",
//         email: "bob@example.com",
//         phone: "+9876543210"
//       }
//     },
//     requests: {
//       request1: {
//         createdBy: "user1",
//         type: "special_request",
//         details: "Need help with furniture."
//       }
//     }
//   };

//   try {
//     await set(ref(db), newData); // Overwrites the entire database
//     console.log("Database overwritten successfully!");
//   } catch (error) {
//     console.error("Error overwriting database:", error.message);
//   }
// };

// overwriteDatabase();
