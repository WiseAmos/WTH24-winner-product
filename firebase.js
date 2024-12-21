const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI1xPgMU9tBrjOarxiMV5DIWxoHkm54Bc",
  authDomain: "wth24-winner-product.firebaseapp.com",
  databaseURL: "https://wth24-winner-product-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wth24-winner-product",
  storageBucket: "wth24-winner-product.appspot.com",
  messagingSenderId: "679030287040",
  appId: "1:679030287040:web:20e048ff85ec4a03785b25",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

module.exports = { db };
