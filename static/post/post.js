
// // Fetch announcements from Firebase and display them
// function fetchAndDisplayAnnouncements() {
//   const announcementsRef = database.ref("announcements");


//   announcementsRef.get().then((snapshot) => {
//     const announcementsSection = document.getElementById("announcements");
//     announcementsSection.innerHTML = ""; // Clear existing content

//     if (snapshot.exists()) {
//       const announcementsData = snapshot.val();

//       // Iterate through the announcements and create HTML for each
//       for (const key in announcementsData) {
//         if (announcementsData.hasOwnProperty(key)) {
//           const announcement = announcementsData[key];

//           // Create announcement element
//           const announcementHTML = `
//             <div class="announcement">
//               <div class="announcement-header d-flex align-items-center">
//                 <img class="avatar" src="${announcement.avatar || "https://picsum.photos/300/200"}" alt="${announcement.author}">
//                 <div>
//                   <h3 class="h6 mb-0">${announcement.author}</h3>
//                   <small>@${announcement.community}</small><br>
//                   <small>${announcement.timeAgo}</small>
//                 </div>
//               </div>
//               <div class="announcement-image">
//                 <img src="${announcement.image || "https://picsum.photos/300/200"}" alt="${announcement.title}">
//               </div>
//               <div class="announcement-content">
//                 <p>${announcement.content}</p>
//                 <a href="#">View more</a>
//               </div>
//             </div>
//           `;

//           // Append the announcement to the section
//           announcementsSection.innerHTML += announcementHTML;
//         }
//       }
//     } else {
//       // Display a message if no announcements are available
//       announcementsSection.innerHTML = "<p>No announcements at the moment.</p>";
//     }
//   }).catch((error) => {
//     console.error("Error fetching announcements:", error);
//   });
// }

// // Fetch and display announcements on page load
// document.addEventListener("DOMContentLoaded", fetchAndDisplayAnnouncements);

async function getAnnouncements() {
    const url = "/data";
    try {
        const response = await fetch(url+"?path=announcements/food");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
      displayAnnouncements(json);
    } catch (error) {
      console.error(error.message);
    }
}

// Function to display announcements
function displayAnnouncements(data) {
    const announcementsSection = document.getElementById("announcements");
    announcementsSection.innerHTML = ""; // Clear previous content

    // Convert the object to an array
    const announcementsArray = Object.values(data);
    
    
    announcementsArray.forEach((announcement) => {
        // const announcementHTML = `
        //     <div class="announcement">
        //         <div class="announcement-title">
        //             <h3>${announcement.title}</h2>
        //         </div>
        //         <div class="announcement-content">
        //             <p>${announcement.description}</p>
        //             <div class="info">
        //                 <i class="fa-solid fa-location-dot"></i>
        //                 <p>${announcement.location}</p>
        //             </div>
        //             <div class="info">
        //                 <i class="fa-solid fa-clock"></i>
        //                 <p>${announcement.timestamp}</p>
        //             </div>
        //             <div class="info">
        //                 <i class="fa-solid fa-user"></i>
        //                 <p>${announcement.createdBy}</p>
        //             </div>
        //         </div>
        //     </div>
        // `;
        const announcementHTML = `
        <div class="announcement">
                <div class="announcement-header">
                    <h3 class="announcement-title">${announcement.title}</h3>
                    <p class="announcement-store">${announcement.store}</p>
                </div>
                <div class="announcement-body">
                    <img src="${announcement.image}" alt="${announcement.title}" class="announcement-image">
                    <p class="announcement-description">${announcement.description}</p>
                    <div class="announcement-details">
                        <p><i class="fa-solid fa-user"></i> <strong>By:</strong> ${announcement.createdBy}</p>
                        <p><i class="fa-solid fa-clock"></i> <strong>Available Time:</strong> ${announcement.time}</p>
                        <p><i class="fa-solid fa-calendar"></i> <strong>Date:</strong> ${announcement.date}</p>
                        <p><i class="fa-solid fa-box"></i> <strong>Quantity Left:</strong> ${announcement.quantityLeft}</p>
                        <p><i class="fa-solid fa-clock"></i> <strong>Posted At:</strong> ${formatDate(announcement.timestamp)}</p>
                        <p><i class="fa-solid fa-location-dot"></i> <strong>Location:</strong> ${announcement.location}</p>
                    </div>
                </div>
            </div>
            `;

        announcementsSection.innerHTML += announcementHTML;
    });
}
  
// Function to display posts
let lastKey = null;
const postsPerPage = 5;

async function getPosts() {
    const url = "/data";
    try {
        const response = await fetch(url+"?path=announcements/clothes");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
      displayPosts(json);
    } catch (error) {
      console.error(error.message);
    }
}

function displayPosts(data) {
    const postsSection = document.getElementById("posts");
    const postsContent = postsSection.querySelector(".donatedClothingsContent");
    postsContent.innerHTML = ""; // Clear previous content

    // Convert the data object to an array
    const postsArray = Object.values(data);

    // Loop through each post and generate HTML
    postsArray.forEach((post) => {
        // const postHTML = `
        //     <div class="clothingCardContainer">
        //         <img src="${post.image}" alt="Clothing Image">
        //         <p class="productTitle">${post.title}</p>
        //         <div class="info">
        //             <p>${post.publisher}</p>
        //             <i class="fa-regular fa-heart heart"></i>
        //         </div>
        //     </div>
        // `;
        // const postHTML = `
        //     <div class="announcement">
        //         <div class="announcement-title">
        //             <h3>${post.title}</h2>
        //         </div>
        //         <div class="announcement-content">
        //             <p>${post.description}</p>
        //             <div class="info">
        //                 <i class="fa-solid fa-location-dot"></i>
        //                 <p>${post.location}</p>
        //             </div>
        //             <div class="info">
        //                 <i class="fa-solid fa-clock"></i>
        //                 <p>${post.timestamp}</p>
        //             </div>
        //             <div class="info">
        //                 <i class="fa-solid fa-user"></i>
        //                 <p>${post.createdBy}</p>
        //             </div>
        //         </div>
        //     </div>
        // `;
        const postHTML = `
            <div class="announcement">
                <div class="announcement-header">
                    <h3 class="announcement-title">${post.title}</h3>
                </div>
                <div class="announcement-body">
                    <img src="${post.image}" alt="${post.title}" class="announcement-image">
                    <p class="announcement-description">${post.description}</p>
                    <div class="announcement-details">
                        <p><i class="fa-solid fa-user"></i> <strong>By:</strong> ${post.createdBy}</p>
                        <p><i class="fa-solid fa-clock"></i> <strong>Available Time:</strong> ${post.time}</p>
                        <p><i class="fa-solid fa-calendar"></i> <strong>Date:</strong> ${post.date}</p>
                        <p><i class="fa-solid fa-box"></i> <strong>Quantity Left:</strong> ${post.quantityLeft}</p>
                        <p><i class="fa-solid fa-clock"></i> <strong>Posted At:</strong> ${formatDate(post.timestamp)}</p>
                        <p><i class="fa-solid fa-location-dot"></i> <strong>Location:</strong> ${post.location}</p>
                    </div>
                </div>
            </div>
        `;
        postsContent.innerHTML += postHTML;
    });
}

  
function formatDate(timestamp) {
    const date = new Date(timestamp); // Convert the timestamp to a Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit format for day

    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
}

document.addEventListener("DOMContentLoaded", () => {
    getAnnouncements();
    getPosts();

    // Get the 'tab' value from the URL
    const tabValue = new URLSearchParams(window.location.search).get('tab');

    if (tabValue) {
        // Find the button with the matching data-target attribute
        const matchingButton = document.querySelector(`.tab[data-target="${tabValue}"]`);

        if (matchingButton) {
            // Simulate a click on the button
            matchingButton.click();
        } else {
            console.error(`No button found with data-target="${tabValue}"`);
        }
    }
}); 

// Add click event listeners to each tab
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove 'active' class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        // Add 'active' class to the clicked tab
        tab.classList.add('active');

        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

        // Show the content section corresponding to the clicked tab
        const targetID = tab.getAttribute('data-target');
        const targetSection = document.getElementById(targetID);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

// Initialize by showing the first tab's content
document.addEventListener('DOMContentLoaded', () => {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const targetID = activeTab.getAttribute('data-target');
        const targetSection = document.getElementById(targetID);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
});


