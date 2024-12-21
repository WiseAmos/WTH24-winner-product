const { db } = require("./firebase.js");
const { ref, set } = require("firebase/database");

const populateUsers = async () => {
  try {
    // Reference to the "users" node
    const usersRef = ref(db, "users");

    // Data to populate the "users" node
    const usersData = {
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
    };

    // Set the data in the "users" node
    await set(usersRef, usersData);

    console.log("Users data populated successfully!");
  } catch (error) {
    console.error("Error populating users data:", error.message);
  }
};

// Run the function
populateUsers();
 
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
