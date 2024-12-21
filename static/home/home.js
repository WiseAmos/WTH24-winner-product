document.addEventListener("DOMContentLoaded", () => {
    // API endpoint for food announcements
    const foodApiUrl = 'http://localhost:3000/data/?path=announcements/food';

    // Select the container where the food announcements will go
    const foodCardsContainer = document.querySelector('.foodCardsContainer');
    console.log(foodCardsContainer);

    // Function to fetch food data and display it dynamically
    async function fetchFoodAnnouncements() {
        try {
            const response = await fetch(foodApiUrl);
            const data = await response.json();
            let count = 0;

            // Check if the data is an array
            if (Array.isArray(data)) {
                // Save the data in sessionStorage
                sessionStorage.setItem('foodAnnouncements', JSON.stringify(data));

                // Clear any previous content in the container
                foodCardsContainer.innerHTML = '';

                // Loop through the data and dynamically create food cards
                data.forEach(foodItem => {
                    count += 1;
                    foodItem.type = 'food'; // Add a type property to the food item
                    foodItem.id = count;
                    const dupFoodItem = foodItem;
                    const { location, store, title, image } = dupFoodItem;

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

                    // Add click event to navigate to the /foodDetails page and store the clicked data
                    foodCard.addEventListener('click', () => {
                        // Clear previously clicked food items before storing the new data
                        sessionStorage.removeItem('previouslyClicked');
                        
                        // Store the clicked food item data in sessionStorage under "previouslyClicked"
                        let previouslyClicked = [];
                        previouslyClicked.push(foodItem); // Add the clicked food item to the array
                        console.log(foodItem);
                        sessionStorage.setItem('previouslyClicked', JSON.stringify(previouslyClicked)); // Save it back to sessionStorage

                        // Redirect to the food details page
                        window.location.href = '/foodDetails';
                    });

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

    // Function to fetch clothing data and store it in sessionStorage
    async function fetchClothingData() {
        try {
            const response = await fetch('http://localhost:3000/data/?path=announcements/clothes');
            const data = await response.json();

            // Save the data in sessionStorage
            sessionStorage.setItem('clothingData', JSON.stringify(data));

            // Select the container where the clothing cards will be displayed
            const contentContainer = document.querySelector('.donatedClothingsContent');

            // Clear the content container before appending new items
            contentContainer.innerHTML = '';

            let count = 0;

            // Loop through the fetched data and create clothing cards dynamically
            data.forEach(item => {
                count += 1;
                item.type = 'clothes';
                item.id = count;
                const clothingCard = document.createElement('div');
                clothingCard.classList.add('clothingCardContainer');

                // Create the image element
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = 'Clothing Image';

                // Create the title element
                const title = document.createElement('p');
                title.classList.add('productTitle');
                title.textContent = item.title;

                // Create the info div with publisher and heart icon
                const info = document.createElement('div');
                info.classList.add('info');

                const publisher = document.createElement('p');
                publisher.textContent = item.createdBy;

                const heartIcon = document.createElement('i');
                heartIcon.classList.add('fa-regular', 'fa-heart', 'heart');

                // Append elements to their respective containers
                info.appendChild(publisher);
                info.appendChild(heartIcon);
                clothingCard.appendChild(img);
                clothingCard.appendChild(title);
                clothingCard.appendChild(info);

                // Add click event to navigate to the /clothingDetails page and store the clicked data
                clothingCard.addEventListener('click', () => {
                    sessionStorage.setItem('clickedClothingItem', JSON.stringify(item));
                    window.location.href = '/foodDetails';
                });

                // Append the clothing card to the content container
                contentContainer.appendChild(clothingCard);
            });
        } catch (error) {
            console.error('Error fetching clothing data:', error);
        }
    }

    // Call the function to fetch and display food announcements when the page loads
    fetchFoodAnnouncements();

    // Call the function to fetch and display the data
    fetchClothingData();
});
