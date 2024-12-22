// Show the modal with the food request details
function showOtherRequestModal(id, image, title, pickup, distance, time, delivery) {
    const modal = document.getElementById('modal');
    
    // Set foodId as a data attribute on the modal
    modal.setAttribute('data-food-id', id);
    
    document.getElementById('modal-image').src = image;  // Image for food request
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-pickup').textContent = `Pickup Location: ${pickup}`;
    document.getElementById('modal-distance').textContent = `Distance: ${distance}`;
    document.getElementById('modal-time').textContent = `Pickup Time: ${time}`;
    document.getElementById('modal-delivery').textContent = `Delivery Location: ${delivery}`;

    // Show the modal
    modal.style.display = 'flex';
}

// Accept food Request
async function acceptFoodRequest() {
    const modal = document.getElementById('modal');
    
    // Retrieve the foodId from the modal's data attribute
    const foodId = modal.getAttribute('data-food-id');
    
    if (!foodId) {
        console.error("Food ID not found!");
        return;
    }

    try {
        // Close the modal after accepting the request
        closeRequestModal();

        // Prepare the body of the PUT request
        const body = JSON.stringify({
            foodId: foodId,      // Send the foodId of the accepted request
            status: 'accepted'   // Update the status to "accepted"
        });

        // Send a PUT request to update the status of the food request
        const response = await fetch("http://localhost:3000/updateFoodRequestStatus", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        // Check if the request was successful
        // Check if the request was successful
        if (response.ok) {
            const data = await response.json();
            console.log("Food request updated successfully:", data);

            // Update the status in the modal to "accepted"
            const statusElement = modal.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'accepted'; // Update the modal's status text
            }

            // Update the status of the food request in the list of food requests (if applicable)
            const foodRequestCard = document.querySelector(`[data-food-id="${foodId}"]`);
            if (foodRequestCard) {
                const cardStatusElement = foodRequestCard.querySelector('.status');
                if (cardStatusElement) {
                    cardStatusElement.textContent = 'accepted';  // Update the status of the card
                }
            }
        } else {
            console.error("Failed to update food request.");
        }
    } catch (error) {
        console.error("Error accepting food request:", error);
    }
}

// Close Other Request Modal
function closeRequestModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Function to display food requests dynamically
function displayFoodRequests(data) {
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = "";  // Clear any existing content

    data.forEach((request, index) => {
        // Skip null or invalid entries
        if (!request) return;

        // Create a card for each food request
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('onclick', `showOtherRequestModal('${request.foodID}', 'https://www.pcma.org/wp-content/uploads/2018/11/food-allergies.jpg', '${request.details}', '${request.location}', '3.5 km', '${request.time}', 'Delivery location')`);

        // Create status indicator for the food request
        const status = document.createElement('div');
        status.classList.add('status');
        status.classList.add(request.status);
        status.textContent = request.status;  // Show the status of the food request
        card.appendChild(status);

        // Set up card content
        card.innerHTML += `
            <img src="https://www.pcma.org/wp-content/uploads/2018/11/food-allergies.jpg" alt="Food Image" class="card-image">
            <div class="card-content">
                <h3 class="card-title">Food Request ${index + 1}</h3>
                <p class="card-summary">
                    <strong>Location:</strong> ${request.location}<br>
                    <strong>Time:</strong> ${request.time}
                </p>
            </div>
        `;
        
        // Append the card to the container
        cardContainer.appendChild(card);
    });
}

function showSpecialRequestModal(id, iconClass, title, location, date, details) {
    console.log("Date being passed:", date);  // Check the 'date' parameter

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: 'long', 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    console.log("Formatted Date:", formattedDate);  // Check the formatted date

    if (!formattedDate || formattedDate === 'Invalid Date') {
        console.error("Invalid date format:", date);
        return; // Exit the function if date is invalid
    }

    console.log("modal-time element:", document.getElementById("modal-time"));

    // Set the data-request-id to the modal
    const modal = document.getElementById("specialRequestModal");
    modal.setAttribute('data-request-id', id);  // Set the request ID to the modal

    // Update modal content
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-location").innerHTML = `<strong>Location:</strong> <span style="text-decoration: underline;">${location}</span>`;
    document.getElementById("modal-time").innerHTML = `<strong>Requested:</strong> <em>${formattedDate}</em>`;
    document.getElementById("modal-details").innerHTML = `<strong>Details:</strong> <span style="font-style: italic;">${details}</span>`;

    // Update icon
    const iconElement = document.getElementById("modal-icon");
    iconElement.innerHTML = `<i class="${iconClass}"></i>`;  // Dynamically set the icon

    // Show the modal
    modal.style.display = "flex";
}


// Fetch food requests
async function fetchFoodRequests() {
    try {
        const response = await fetch("http://localhost:3000/data/?path=foodRequests");
        let data = await response.json();
        console.log(data);
        
        // Check if the data is not an array, and convert it into an array
        if (!Array.isArray(data)) {
            data = Object.values(data); // Convert object to array of values
        }

        // Call the function to display food requests
        displayFoodRequests(data);
    } catch (error) {
        console.error("Error fetching food requests:", error);
    }
}

function loadSpecialRequests() {
    fetch("http://localhost:3000/data/?path=specialRequests")
        .then(response => response.json())
        .then(data => {

            // Check if the data is not an array, and convert it into an array
            if (!Array.isArray(data)) {
                data = Object.values(data); // Convert object to array of values
            }

            const specialRequestsContainer = document.querySelector('.special-request-section .card-container');
            specialRequestsContainer.innerHTML = ''; // Clear existing content

            // Loop through the special requests and create HTML for each one
            data.forEach((request, key) => {
                // Create HTML for each request
                const card = document.createElement('div');
                card.classList.add('card');
                card.setAttribute('data-request-id', request.requestID); // Add data attribute for easy identification
                card.onclick = () => showSpecialRequestModal(
                    request.requestID, // Pass requestID to the modal
                    request.type === 'transport' ? 'fas fa-car' : request.type === 'furniture' ? 'fas fa-couch' : 'fas fa-handshake',
                    request.details,
                    request.location,
                    request.date,
                    request.details
                );

                // Add a status bar at the top-right corner of each card
                const statusBar = document.createElement('div');
                statusBar.classList.add('status-bar');
                statusBar.textContent = 'pending'; // Set the initial status to 'pending'
                card.appendChild(statusBar); // Append the status bar to the card

                // Create icon for each request type
                const iconDiv = document.createElement('div');
                iconDiv.classList.add('card-icon');
                const icon = document.createElement('i');
                icon.classList.add(request.type === 'transport' ? 'fas' : 'fas', request.type === 'transport' ? 'fa-car' : request.type === 'furniture' ? 'fa-couch' : 'fa-handshake');
                iconDiv.appendChild(icon);

                // Create card content
                const cardContent = document.createElement('div');
                cardContent.classList.add('card-content');
                const cardTitle = document.createElement('h3');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = request.details;
                const cardSummary = document.createElement('p');
                cardSummary.classList.add('card-summary');
                cardSummary.innerHTML = `<strong>Location:</strong> ${request.location}<br>
                                         <strong>Requested:</strong> ${request.date}`;

                cardContent.appendChild(cardTitle);
                cardContent.appendChild(cardSummary);

                card.appendChild(iconDiv);
                card.appendChild(cardContent);
                
                // Append the card to the container
                specialRequestsContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching special requests:', error));
}

function closeSpecialRequestModal(){
    const modal = document.getElementById('specialRequestModal');
    modal.style.display = 'none';
}

// Accept Special Request
async function acceptSpecialRequest() {
    const modal = document.getElementById('specialRequestModal');
    
    // Retrieve the request ID from the modal's data attribute
    const requestId = modal.getAttribute('data-request-id');
    
    if (!requestId) {
        console.error("Request ID not found!");
        return;
    }

    try {
        // Close the modal after accepting the request
        closeSpecialRequestModal();

        // Prepare the body of the PUT request
        const body = JSON.stringify({
            requestId: requestId,   // Send the requestId of the accepted request
            status: 'accepted'      // Update the status to "accepted"
        });

        // Send a PUT request to update the status of the special request
        const response = await fetch("http://localhost:3000/updateSpecialRequestStatus", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        // Check if the request was successful
        if (response.ok) {
            const data = await response.json();
            console.log("Special request updated successfully:", data);

            // Update the status in the modal to "accepted"
            const statusElement = modal.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'accepted'; // Update the modal's status text
            }

            // Update the status of the special request in the list of special requests
            const specialRequestCard = document.querySelector(`[data-request-id="${requestId}"]`);
            if (specialRequestCard) {
                const cardStatusElement = specialRequestCard.querySelector('.status-bar');
                if (cardStatusElement) {
                    cardStatusElement.textContent = 'accepted';  // Update the status of the card
                }
            }
        } else {
            console.error("Failed to update special request.");
        }
    } catch (error) {
        console.error("Error accepting special request:", error);
    }
}


// Call the function to load special and normal requests when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSpecialRequests(); // Load special requests
    fetchFoodRequests();   // Fetch food requests if needed
});
