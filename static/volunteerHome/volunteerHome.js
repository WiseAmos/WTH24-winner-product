// Show Other Request Modal
function showOtherRequestModal(id, image, title, pickup, distance, time, delivery) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-image').src = image;  // image for other request
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-pickup').textContent = `Pickup Location: ${pickup}`;
    document.getElementById('modal-distance').textContent = `Distance: ${distance}`;
    document.getElementById('modal-time').textContent = `Pickup Time: ${time}`;
    document.getElementById('modal-delivery').textContent = `Delivery Location: ${delivery}`;
    modal.style.display = 'flex';
}

// Close Other Request Modal
function closeRequestModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Accept Other Request
function acceptRequest() {
    alert('Request accepted!');
    closeRequestModal();
}

function showSpecialRequestModal(id, icon, title, location, time, description) {
    // Set the modal content dynamically
    document.getElementById("modal-icon").className = icon;
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-location").textContent = "Location: " + location;
    document.getElementById("modal-request").textContent = "Details/Description: " + description;
    document.getElementById("modal-time").textContent = "Requested: " + time;
    
    // Show the modal
    document.getElementById("special-modal").style.display = "block";
}

function closeSpecialModal() {
    document.getElementById("special-modal").style.display = "none";
}

function acceptSpecialRequest() {
    alert("Request accepted!");
    closeSpecialModal();
}
