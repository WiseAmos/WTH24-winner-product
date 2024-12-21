import { db } from "./firebase.js"; // Import Firestore instance
import { collection, addDoc } from "firebase/firestore";

// Example Function to Add a User
const addUser = async (userData) => {
  try {
    await addDoc(collection(db, "users"), userData);
    console.log("User added successfully!");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Example Usage
addUser({
  userId: "unique_user_id",  // Use the JWT's user ID
  name: "John Doe",
  email: "johndoe@gmail.com",
  phone: "+1234567890",
  role: "volunteer",
  profile: {
    dob: "1990-01-01",
    image: "image_url_here"
  }
});
