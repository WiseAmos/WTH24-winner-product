
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

// Function to display announcements
function displayAnnouncements(data) {
    const announcementsSection = document.getElementById("announcements");
    announcementsSection.innerHTML = ""; // Clear previous content

    data.forEach((announcement) => {
    const announcementHTML = `
        <div class="announcement">
        <div class="announcement-header d-flex align-items-center">
            <img class="avatar" src="${announcement.avatar}" alt="${announcement.name}">
            <div>
            <h3 class="h6 mb-0">${announcement.name}</h3>
            <small>@${announcement.community}</small><br>
            <small>${announcement.timeAgo}</small>
            </div>
        </div>
        <div class="announcement-image">
            <img src="${announcement.image}" alt="${announcement.title}">
        </div>
        <div class="announcement-content">
            <p>${announcement.content}</p>
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

function displayPosts(data) {
const postsSection = document.getElementById("posts");

data.forEach((post) => {
    const postHTML = `
    <div class="post">
        <div class="post-header d-flex align-items-center">
        <img class="avatar" src="${post.avatar}" alt="${post.name}">
        <div>
            <h3 class="h6 mb-0">${post.name}</h3>
            <small>@${post.community}</small><br>
            <small>${post.timeAgo}</small>
        </div>
        </div>
        <div class="post-image">
        <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="post-content">
        <p>${post.content}</p>
        <a href="#">View more</a>
        </div>
        <div class="post-actions d-flex justify-content-between">
        <button class="like btn btn-link">🤍 ${post.likes} Likes</button>
        <button class="comment btn btn-link">💬 ${post.comments} Comments</button>
        </div>
    </div>
    `;
    postsSection.innerHTML += postHTML;
});
}
  
// Fetch and display announcements
database.ref("announcements").get().then((snapshot) => {
if (snapshot.exists()) {
    const announcementsData = Object.values(snapshot.val());
    displayAnnouncements(announcementsData);
} else {
    console.log("No announcements available");
}
});

// Fetch and display posts with pagination
function fetchPosts(loadMore = false) {
let query = database.ref("posts").orderByKey().limitToFirst(postsPerPage);

if (lastKey && loadMore) {
    query = database
    .ref("posts")
    .orderByKey()
    .startAfter(lastKey)
    .limitToFirst(postsPerPage);
}

query.get().then((snapshot) => {
    if (snapshot.exists()) {
    const postsData = Object.entries(snapshot.val());
    lastKey = postsData[postsData.length - 1][0]; // Update last key for pagination

    const posts = postsData.map(([key, value]) => value);
    displayPosts(posts);
    } else {
    console.log("No more posts available");
    }
});
}

// Initial fetch for posts
fetchPosts();

// Infinite scrolling for posts
window.addEventListener("scroll", () => {
if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
) {
    fetchPosts(true); // Load more posts
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


