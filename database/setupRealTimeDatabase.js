const { db } = require("../firebase.js");
const { ref, set } = require("firebase/database");

const populateDatabase = async () => {
  try {
    // Reference to the "data" node
    const appDataRef = ref(db, "data");

    // Data to populate the "data" node
    const appData = {
      users: {
        person1: {
          role: "person_in_need",
          name: "John Doe",
          dob: "1990-01-01",
          phone: "+1234567890",
          address: "123 Main Street, City",
          dietary_needs: "Vegetarian",
          mobility_issues: "Yes"
        },
        organization1: {
          role: "organization",
          organization_name: "Helping Hands",
          account_name: "helping_hands_account",
          representative: {
            name: "Alice Johnson",
            designation: "Manager",
            dob: "1980-05-10",
            email: "alice.johnson@example.com",
            phone: "+1122334455"
          },
          password: "securepassword123",
          addresses: ["123 Charity Lane, City A", "456 Donation Drive, City B"],
          about: "We provide food and shelter for those in need."
        },
        food_stall1: {
          role: "food_stall",
          organization_name: "ABC Supermarket",
          account_name: "abc_supermarket",
          representative: {
            name: "Emily Stone",
            designation: "Owner",
            dob: "1985-11-25",
            email: "emily.stone@example.com",
            phone: "+2233445566"
          },
          password: "mypassword123",
          about: "We provide fresh produce and groceries.",
          location: "789 Market Street, City C"
        },
        volunteer1: {
          role: "volunteer",
          image: "https://example.com/image.jpg",
          name: "Charlie Brown",
          dob: "1992-06-15",
          email: "charlie.brown@example.com",
          phone: "+3344556677",
          password: "volunteerpassword123"
        }
      },
      announcements: {
        announcement1: {
          createdBy: "organization1", // Reference to the organization's ID
          title: "Excess Food Alert",
          description: "We have leftover food that will expire tonight. Available for pickup from 7 PM to 10 PM.",
          location: "123 Charity Lane, City A",
          timestamp: new Date().toISOString()
        },
        announcement2: {
          createdBy: "food_stall1", // Reference to the food stall's ID
          title: "Free Bread and Pastries",
          description: "We have excess bread and pastries that need to be given away. Please visit before closing at 9 PM.",
          location: "789 Market Street, City C",
          timestamp: new Date().toISOString()
        }
      },
      posts: {
        post1: {
          createdBy: "organization1", // Reference to the organization's ID
          title: "Excess Rice Donations",
          description: "We have 20kg of excess rice to give away. Please contact us for pickup details.",
          timestamp: new Date().toISOString()
        },
        post2: {
          createdBy: "food_stall1", // Reference to the food stall's ID
          title: "Surplus Vegetables",
          description: "We have fresh vegetables available for free distribution. Contact us for more details.",
          timestamp: new Date().toISOString()
        }
      },
      requests: {
        request1: {
          createdBy: "person1", // Reference to the needy person's ID
          type: "transport",
          details: "Need a volunteer to help me reach the healthcare center for a checkup.",
          status: "pending", // Can be "pending", "in-progress", or "completed"
          timestamp: new Date().toISOString()
        },
        request2: {
          createdBy: "person1", // Reference to the needy person's ID
          type: "furniture_movement",
          details: "Need help moving a heavy table to another room.",
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
