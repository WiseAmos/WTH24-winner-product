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

// Show Special Request Modal
function showSpecialRequestModal(requestId, iconClass, title, location, requestTime, postDate, contactInfo, description) {
    // Set modal content for special request
    document.getElementById('special-modal').style.display = 'flex';
    document.getElementById('modal-icon').className = iconClass;  // iconClass for special request
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-location').innerText = `Location: ${location}`;
    document.getElementById('modal-request').innerText = `Request: ${title}`;
    document.getElementById('modal-time').innerText = `Requested: ${requestTime}`;
    
    // Added new fields for post date and requested time
    document.getElementById('modal-post-date').innerText = `Posted on: ${postDate}`;
    document.getElementById('modal-request-time').innerText = `Request Needed By: ${requestTime}`;
    
    // Additional details for special request
    document.getElementById('modal-contact').innerText = `Contact Info: ${contactInfo}`;
    document.getElementById('modal-description').innerText = `Description: ${description}`;
}

// Close Special Request Modal
function closeSpecialModal() {
    const modal = document.getElementById('special-modal');
    modal.style.display = 'none';
}

// Accept Special Request
function acceptSpecialRequest() {
    alert('Special request accepted!');
    closeSpecialModal();
}
