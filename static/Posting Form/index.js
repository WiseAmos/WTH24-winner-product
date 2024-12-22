const food = JSON.parse(sessionStorage.getItem("previouslyClicked"))
sessionStorage.setItem("clicked",true)
const food_identifier = food["id"]
console.log(food)
document.addEventListener("DOMContentLoaded",()=>{
    const button = document.getElementById("sign-up")
    console.log(button)
    document.getElementById("image-banner").src = food["image"]
    document.getElementById("title").innerText = food["title"]
    document.getElementById("about").innerText = food["description"]
    document.getElementById("location").innerText = food["location"]
    document.getElementById("date").innerText = food["date"]
    document.getElementById("time").innerText = food["time"]
    setTimeout(() => updateProgress((food["totalQuantity"]-food["quantityLeft"]),food["totalQuantity"]), 10);
    button.addEventListener("click",()=>{
      if(sessionStorage.getItem("clicked")=="true"){
        console.log("CLICKED")
        const newQuantityLeft = food["quantityLeft"] - 1;
        postData("announcements/"+food["type"]+"/" + food_identifier, { quantityLeft: newQuantityLeft });
        setTimeout(() => updateProgress((food["totalQuantity"]-newQuantityLeft),food["totalQuantity"]), 10);
        sessionStorage.setItem("clicked",false)

        food["quantityLeft"] = newQuantityLeft
        sessionStorage.setItem("previouslyClicked",JSON.stringify(food))

        token = localStorage.getItem("authToken")
        const parts = token.split('.');
        if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
        }

        // Decode the payload (the second part of the JWT)
        const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/'); // Base64URL to Base64
        const payloadJson = atob(payloadBase64); // Decode Base64
        const payload = JSON.parse(payloadJson); // Parse JSON

        // Extract username or other information
        const username = payload.accountName; // Adjust this based on your token structure
        console.log(recomendme(username,food["title"]))
        
      }
    })
})
// Function to update progress bar with keyframes
function updateProgress(current, total) {
    const progressValue = document.querySelector('.progress-value');
    const progressLabel = document.querySelector('#progresslabel');
  
    // Calculate the percentage
    const percentage = (current / total) * 100;
  
    // Remove existing animation (if any)
    progressValue.style.animation = 'none';
  
    // Trigger reflow to restart the animation
    progressValue.offsetWidth;
  
    // Apply new keyframe animation
    progressValue.style.animation = `load 1s forwards`;
  
    // Dynamically create keyframes for the updated width
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes load {
        0% { width: ${progressValue.style.width || '0%'}; }
        100% { width: ${percentage}%; }
      }
    `;
  
    // Append new keyframes
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  
    // Update the progress label
    progressLabel.textContent = `${current}/${total}`;
  }
  
  

  async function getData(path) {
    const url = "/data";
    try {
      const response = await fetch(url+"?path="+path);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }



  async function postData(path,datainside) {
    const url = "/data";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          path:path,
          data:datainside
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }


  async function recomendme(username,action){
    response = await fetch("/recomendations/?user="+username+"?"+action)

    console.log("hit")
    let data = await response.json();
    console.log(data)
    await postData(data["path"],data["important_data"])
  }     





  document.addEventListener("DOMContentLoaded", () => {
    // API endpoint for food announcements
    const foodApiUrl = '/data?path=announcements';
    
    // Select the container where the food announcements will go
    const foodCardsContainer = document.querySelector('.foodCardsContainer');
    console.log(foodCardsContainer);

    // Function to fetch food data and display it dynamically
    async function fetchFoodAnnouncements() {
        try {
            const response = await fetch(foodApiUrl);
            let data = await response.json();
            data = data["food"]
            temp_data = []
            for (let i=0;i<data.length;i++){
                if (data[i]!=null){
                    temp_data.push(data[i])
                }
            }
        
            data = temp_data
            console.log(data)
            // Check if the data is an array
            if (Array.isArray(data)) {
                // Save the data in sessionStorage
                sessionStorage.setItem('c', JSON.stringify(data));

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

                    // Add click event to navigate to the /foodDetails page and store the clicked data
                    foodCard.addEventListener('click', () => {
                      sessionStorage.setItem('previouslyClicked', JSON.stringify(foodItem)); // Save it back to sessionStorage

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
            const response = await fetch('/data/?path=announcements/clothAnnouncements');
            const data = await response.json();
    
            // Save the data in sessionStorage
            sessionStorage.setItem('clothingData', JSON.stringify(data));
    
            // Select the container where the clothing cards will be displayed
            const contentContainer = document.querySelector('.donatedClothingsContent');
    
            // Clear the content container before appending new items
            contentContainer.innerHTML = '';
    
            // Loop through the fetched data and create clothing cards dynamically
            data.forEach(item => {
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
                publisher.textContent = item.publisher;
    
                const heartIcon = document.createElement('i');
                heartIcon.classList.add('fa-regular', 'fa-heart', 'heart');
    
                // Append elements to their respective containers
                info.appendChild(publisher);
                info.appendChild(heartIcon);
                clothingCard.appendChild(img);
                clothingCard.appendChild(title);
                clothingCard.appendChild(info);
    
                // Append the clothing card to the content container
                contentContainer.appendChild(clothingCard);
            });
        } catch (error) {
            console.error('Error fetching clothing data:', error);
        }
    }

    // Call the function to fetch and display food announcements when the page loads
    fetchFoodAnnouncements();
});