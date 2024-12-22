// Fetch query parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");
const id = urlParams.get("id");

if (!category || !id) {
  alert("Invalid announcement details!");
  window.history.back();
}

// Fetch the announcement details and populate the form
async function loadAnnouncementDetails() {
  try {
    const response = await fetch(`/announcement/details?category=${category}&id=${id}`);
    console.log("testing");
    if (!response.ok) {
      throw new Error("Failed to fetch announcement details.");
    }

    const data = await response.json();

    // Populate form fields
    document.getElementById("type").value = category;
    document.getElementById("store").value = data.store || ""; // Default to empty if not available
    document.getElementById("title").value = data.title || "";
    document.getElementById("description").value = data.description || "";
    document.getElementById("quantity-left").value = data.quantityLeft || 0;
    document.getElementById("total-quantity").value = data.totalQuantity || 0;
    document.getElementById("date").value = data.date || ""; // Assuming date is stored in YYYY-MM-DD format
    document.getElementById("time").value = data.time || "";
    document.getElementById("location").value = data.location || "";
  } catch (error) {
    console.error(error.message);
    alert("An error occurred while loading the announcement.");
    window.history.back();
  }
}

// Handle form submission
document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`/announcement/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: data.type,
        id: id,
        data: {
          store: data.store,
          title: data.title,
          description: data.description,
          quantityLeft: data.quantityLeft,
          totalQuantity: data.totalQuantity,
          date: data.date,
          time: data.time,
          location: data.location,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update the announcement.");
    }

    alert("Announcement updated successfully!");
    window.location.href = "/organisation";
  } catch (error) {
    console.error(error.message);
    alert("An error occurred while updating the announcement.");
  }
});

// Back button functionality
document.getElementById("back-button").addEventListener("click", () => {
  window.history.back();
});

// Load the announcement details on page load
loadAnnouncementDetails();
