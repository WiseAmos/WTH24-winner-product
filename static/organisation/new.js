// Back button functionality
document.getElementById("back-button").addEventListener("click", () => {
    window.history.back();
  });
  
  // Function to decode a JWT token
function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
  
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  let accountName;
  if (token) {
    const decodedToken = decodeToken(token);
    accountName = decodedToken.accountName;
  
    // Use the accountName in your object
    const newData = {
      createdBy: accountName, // Replace with dynamic account
      // Other properties...
    };
  
    console.log(newData);
  } else {
    console.error('Token not found in localStorage');
  }

  // Handle form submission
  document.getElementById("new-announcement-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch("/announcement/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: data.type,
          data: {
            store: data.store || null, // Default to empty if not available
            title: data.title,
            description: data.description,
            quantityLeft: parseInt(data.quantityLeft),
            totalQuantity: parseInt(data.totalQuantity),
            date: data.date,
            time: data.time,
            location: data.location,
            image: data.image || null,
            timestamp: new Date().toISOString(),
            createdBy: accountName, // Replace with dynamic account
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create the announcement.");
      }
  
      alert("Announcement created successfully!");
      window.location.href = "/organisation";
    } catch (error) {
      console.error(error.message);
      alert("An error occurred while creating the announcement.");
    }
  });
  
