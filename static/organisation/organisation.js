
// Fetch and display posts
async function loadPosts() {
    const response = await fetch("/data?path=announcements");
    const data = await response.json();
  
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = "";
  
    Object.keys(data).forEach((category) => {
      Object.entries(data[category]) // food or clothes
        .filter(([id, post]) => post !== null) // Filter out null values
        .forEach(([id, post]) => {
          console.log(post);
          if (post.createdBy == accountName) { // Check if the post was created by the current user
            const card = document.createElement("div");
            card.className = "post-card";
            card.innerHTML = `
              <img class="post-image" src="${post.image}" alt="${post.title}">
              <h3>${post.title} (${category})</h3>
              <p><strong>Description:</strong> ${post.description}</p>
              <p><strong>Quantity:</strong> ${post.quantityLeft} / ${post.totalQuantity}</p>
              <button onclick="editPost('${category}', '${id}')">Edit</button>
            `;
            postsContainer.appendChild(card);
          }
        });
    });
  }
  
  // Redirect to edit page
  function editPost(category, id) {
    window.location.href = `edit?category=${category}&id=${id}`;
  }
  
  // Redirect to New Post Page
  document.getElementById("new-post-btn").addEventListener("click", () => {
    window.location.href = `new.html`;
  });
  
  // Back Button Logic
  document.getElementById("back-button").addEventListener("click", () => {
    window.history.back();
  });
  
  // Decode JWT Token
  function decodeToken(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  
    return JSON.parse(jsonPayload);
  }
  
  // Retrieve the token from localStorage
  const token = localStorage.getItem("authToken");
  let accountName;
  if (token) {
    const decodedToken = decodeToken(token);
    accountName = decodedToken.accountName;
  } else {
    console.error("Token not found in localStorage");
  }
  
  // Initial Load
  loadPosts();
  