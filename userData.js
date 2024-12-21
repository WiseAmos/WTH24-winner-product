// Import Firestore from Firebase SDK
const { db } = require("./firebase.js"); // Make sure you have firebase.js configured
const { collection, addDoc } = require("firebase/firestore");

// Function to set up collections and documents
const setupDatabase = async () => {
  try {
    // 1. Create "users" collection
    await addDoc(collection(db, "users"), {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "+1234567890",
      role: "volunteer",
      profile: {
        dob: "1990-01-01",
        image: "https://example.com/profile.jpg",
      },
    });

    await addDoc(collection(db, "users"), {
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      phone: "+9876543210",
      role: "organization",
      profile: {
        dob: "1985-05-15",
        image: "https://example.com/org.jpg",
      },
    });

    // 2. Create "requests" collection
    await addDoc(collection(db, "requests"), {
      createdBy: "needyUserId123", // Replace with actual user ID
      type: "food_delivery",
      details: "Need a volunteer to deliver groceries.",
      status: "pending",
      pickupLocation: { lat: 1.3521, lng: 103.8198 },
      deliveryLocation: { lat: 1.3645, lng: 103.9918 },
      createdAt: new Date().toISOString(),
    });

    // 3. Create "locations" collection
    await addDoc(collection(db, "locations"), {
      name: "ABC Supermarket",
      type: "food_stall",
      address: "123 Main Street, City",
      geoLocation: { lat: 1.3521, lng: 103.8198 },
      contact: { phone: "+1234567890", email: "info@abc.com" },
      about: "We provide food for those in need.",
    });

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Error setting up database:", error.message);
  }
};

// Run the function
setupDatabase();
