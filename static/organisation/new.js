
// Back button functionality
document.getElementById("back-button").addEventListener("click", () => {
    window.history.back();
  });
  
  // Handle image upload and preview
  document.getElementById("image-upload").addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (file) {
      const base64Image = await getBase64(file);
      document.getElementById("announcement-image").src = base64Image; // Set the image preview
      document.getElementById("announcement-image").setAttribute("data-base64", base64Image); // Store base64 in a custom attribute
    }
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
  
  // Handle form submission
  document.getElementById("new-announcement-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    const base64Image = document.getElementById("announcement-image").getAttribute("data-base64");
  
    if (!base64Image) {
      alert("Please upload an image for the announcement.");
      return;
    }
  
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
            quantityLeft: parseInt(data.totalQuantity),
            totalQuantity: parseInt(data.totalQuantity),
            date: data.date,
            time: data.time,
            location: data.location,
            image: base64Image, // Send base64 image
            timestamp: new Date().toISOString(),
            createdBy: accountName, // Replace with dynamic account
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create the announcement.", response.error);
      }
  
      alert("Announcement created successfully!");
      window.location.href = "/organisation";
    } catch (error) {
      console.error(error.message);
      alert("An error occurred while creating the announcement.");
    }
  });
  
  // Utility function to convert file to base64
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  