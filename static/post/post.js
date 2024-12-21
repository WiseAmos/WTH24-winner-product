
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
        const response = await fetch(url+"?path=data/announcements");
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
        const announcementHTML = `
            <div class="announcement">
                <div class="announcement-header d-flex align-items-center">
                    <img class="avatar" src="${announcement.avatar}" alt="${announcement.name}">
                    <div>
                        <h3 class="h6 mb-0">${announcement.createdBy}</h3>
                        <small>@${announcement.community}</small><br>
                        <small>${announcement.timeAgo}</small>
                    </div>
                </div>
            <div class="announcement-image">
                <img src="${announcement.image}" alt="${announcement.title}">
            </div>
                <div class="announcement-content">
                    <p>${announcement.description}</p>
                    <p>${announcement.location}</p>
                    <p>${announcement.timestamp}</p>
                    <a href="#">View more</a>
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
        const response = await fetch(url+"?path=data/posts");
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
        const postHTML = `
            <div class="clothingCardContainer">
                <img src="${post.image}" alt="Clothing Image">
                <p class="productTitle">${post.title}</p>
                <div class="info">
                    <p>${post.publisher}</p>
                    <i class="fa-regular fa-heart heart"></i>
                </div>
            </div>
        `;
        postsContent.innerHTML += postHTML;
    });
}

  
// Infinite scrolling for posts
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
    ) {
        fetchPosts(true); // Load more posts
    }
});

document.addEventListener("DOMContentLoaded", () => {
    getAnnouncements();
    getPosts();
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


