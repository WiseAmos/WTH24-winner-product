// Function to update progress bar with keyframes
function updateProgress(current, total) {
    const progressValue = document.querySelector('.progress-value');
    const progressLabel = document.querySelector('#progresslabel');
  
    // Calculate the percentage
    const percentage = (current / total) * 100;
  
    // Remove existing animation (if any)
    progressValue.style.animation = 'none';
  
    // Trigger reflow to restart the animation
    progressValue.offsetWidth;
  
    // Apply new keyframe animation
    progressValue.style.animation = `load 1s forwards`;
  
    // Dynamically create keyframes for the updated width
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes load {
        0% { width: ${progressValue.style.width || '0%'}; }
        100% { width: ${percentage}%; }
      }
    `;
  
    // Append new keyframes
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  
    // Update the progress label
    progressLabel.textContent = `${current}/${total}`;
  }
  
  // Example usage: update the progress bar dynamically
  setTimeout(() => updateProgress(5, 10), 10); // Updates to 8/10 after 1 second
  


const {initializeApp} = require("firebase/app");
const {getDatabase} = require("firebase/database");


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://wth24-winner-product-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
var starCountRef =database.ref('posts/' + postId + '/starCount');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  updateStarCount(postElement, data);
});