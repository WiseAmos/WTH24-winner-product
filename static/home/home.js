// home.js
document.addEventListener("DOMContentLoaded", () => {
    // API endpoint for food announcements
    const foodApiUrl = 'http://localhost:3000/data/?path=data/foodAnnouncement';
    
    // Select the container where the food announcements will go
    const foodCardsContainer = document.querySelector('.foodCardsContainer');
    console.log(foodCardsContainer);

    // Function to fetch food data and display it dynamically
    async function fetchFoodAnnouncements() {
        try {
            const response = await fetch(foodApiUrl);
            const data = await response.json();
            
            // Check if the data is an array
            if (Array.isArray(data)) {
                // Clear any previous content in the container
                foodCardsContainer.innerHTML = '';

                // Loop through the data and dynamically create food cards
                data.forEach(foodItem => {
                    const { location, store, title, image } = foodItem;

                    // Create a new div for the food card
                    const foodCard = document.createElement('div');
                    foodCard.classList.add('foodCard');

                    // Set the content of the food card
                    foodCard.innerHTML = `
                        <img src="${image}" alt="${title}">
                        <div class="foodCardContent">
                            <h2>${title}</h2>
                            <div class="info">
                                <i class="fa-solid fa-location-dot"></i>
                                <p>${location}</p>
                            </div>
                            <div class="info">
                                <i class="fa-solid fa-house-medical-flag"></i>
                                <p>${store}</p>
                            </div>
                        </div>
                    `;

                    // Append the food card to the food cards container
                    foodCardsContainer.appendChild(foodCard);
                });
            } else {
                console.error('Data is not in expected format');
            }
        } catch (error) {
            console.error('Error fetching food announcements:', error);
        }
    }

    // Call the function to fetch and display food announcements when the page loads
    fetchFoodAnnouncements();
});