
// Obtain current location

//https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=XXXXXXXXXXXX&longitude=XXXXXXXXXXXX&localityLanguage=en

// why wrong location?
const findMyState = () => {
    

    return new Promise((resolve, reject) => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          };

        const success = (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude }); // Resolve the Promise with the coordinates
        };

        const error = () => {
            reject('Unable to retrieve your location'); // Reject the Promise on error
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    });
};

// Using the function with Promises
findMyState()
    .then(({ latitude, longitude }) => {
        console.log("Current Location: ", latitude, longitude);
        loadMap(latitude, longitude);
        // loadMap(1.33473650438665, 103.740093530646);
        getNearbyLocations(latitude, longitude);
    })
    .catch((error) => {
        console.error(error);
    });



// Declare map
let map;


// Load the map
function loadMap(latitude, longitude) {
    const key = 'WPNXBfcimJe6wNkT5Yyy';
    const source = new ol.source.TileJSON({
    url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`,
    tileSize: 512,
    crossOrigin: 'anonymous'
    });
    
    map = new ol.Map({
    layers: [
        new ol.layer.Tile({
        source: source
        })
    ],
    target: 'map',
        view: new ol.View({
            constrainResolution: true,
            center: ol.proj.fromLonLat([longitude, latitude]),
            zoom: 17
        })
    });
    
    // Add a current marker
    const markerElement = document.createElement('div');
    markerElement.className = 'current-marker';

    const marker = new ol.Overlay({
        position: ol.proj.fromLonLat([longitude, latitude]), // Marker position
        positioning: 'center-center',
        element: markerElement,
        stopEvent: false
    });
    
    map.addOverlay(marker);

    // // Add a custom marker
    // const markerElement = document.createElement('div');
    // markerElement.className = 'custom-marker';

    // const marker = new ol.Overlay({
    //     position: ol.proj.fromLonLat([longitude, latitude]), // Marker position
    //     positioning: 'center-center',
    //     element: markerElement,
    //     stopEvent: false
    // });
    
    // map.addOverlay(marker);
}

async function getNearbyLocations(latitude, longitude) {
    // Get nearby locations

    const url = "/data";
    try {
        const response = await fetch(url+"?path=announcements/food");

        const data = await response.json();

        // if (Array.isArray(data)) {
        //     // Clear any previous content in the container
        //     // foodCardsContainer.innerHTML = '';

        //     // Loop through the data and dynamically create food cards
        //     data.forEach(foodItem => {
        //         console.log(foodItem.location);
        //         turnToLonLat(foodItem.location)
        //             .then(({ lat, lon }) => {
        //                 CalculateDistance(lat, lon)
        //                     .then(distance => {
        //                         if (distance <= 1000)
        //                             customMarker(foodItem);
        //                     });
        //                 // customMarker(foodItem);
        //             });
        //         // CalculateDistance(latitude, longitude);
        //     });
        // }
        if (Array.isArray(data)) {
            // Use a for...of loop to process each foodItem sequentially
            for (const foodItem of data) {
                console.log(foodItem.location);

                try {
                    const { lat, lon } = await turnToLonLat(foodItem.location); // Wait for turnToLonLat to finish


                    // Distance to show only nearby events
                    // const distance = await calculateDistance(lat, lon, latitude, longitude); // Wait for distance calculation

                    // if (distance <= 1500) {
                    //     customMarker(foodItem, lat, lon); // Add marker if distance is within 1000m
                    // }

                    // Show all markers
                    customMarker(foodItem, lat, lon); // Add marker if distance is within 1000m
                    
                } catch (error) {
                    console.error(`Error processing food item ${foodItem.location}:`, error.message);
                }
            }
        }

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
    } 
    catch (error) {
      console.error(error.message);
    }
}

async function turnToLonLat(location) {
    const key = "6767181327e2e830118235vry289ca8"; // Replace with your actual API key
    const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}&api_key=${key}`;
    
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error fetching geocode data: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error("No location data found.");
        }

        // Extract the first result's longitude and latitude
        console.log("Data[0]:", data[0]);
        const { lat, lon } = data[0];
        
        console.log('Latitude:', lat, 'Longitude:', lon);
        return { lat, lon };
        // return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (error) {
        console.error("Error:", error);
        return null; // Return null if something goes wrong
    }
}

// // Example usage
// turnToLonLat("New York").then(coords => {
//     if (coords) {
//         console.log(`Longitude: ${coords.lon}, Latitude: ${coords.lat}`);
//     } else {
//         console.log("Failed to fetch coordinates.");
//     }
// });


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    // lat1 = 1.2923514;
    // lon1 = 103.8586837;
    // lat2 = 1.282302;
    // lon2 = 103.858528;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    console.log('Distance:', Math.round(distance), 'meters');
    return Math.round(distance);
}


function customMarker(item, latitude, longitude) {
    console.log('Custom Marker:', item);

    // Add a custom marker
    const markerElement = document.createElement('div');
    markerElement.className = 'shelter-marker';

    const marker = new ol.Overlay({
        position: ol.proj.fromLonLat([longitude, latitude]), // Marker position
        positioning: 'center-center',
        element: markerElement,
        stopEvent: false
    });
    
    map.addOverlay(marker);

    // Create a popup for displaying event details
    const popupElement = document.createElement('div');
    popupElement.className = 'popup';
    popupElement.innerHTML = `
        <div class="popup-content">
            <h3>${item.title}</h3>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Date:</strong> ${item.date}</p>
            <p><strong>Store:</strong> ${item.store}</p>
            <p><strong>Time:</strong> ${item.time}</p>
            <p><strong>Quantity Left:</strong> ${item.quantityLeft}</p>
            <button onclick="viewMore('${item.id}')">View More</button>
        </div>
    `;

    const popup = new ol.Overlay({
        element: popupElement,
        positioning: 'bottom-center',
        stopEvent: true,
        autoPan: true,
        autoPanAnimation: { duration: 250 },
    });

    // Add click listener to the marker
    markerElement.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the map's click handler from firing
        popup.setPosition(ol.proj.fromLonLat([longitude, latitude]));
        map.addOverlay(popup);
    });

    // Add a click listener to the map to hide the popup
    map.getViewport().addEventListener('click', (event) => {
        if (popup.getPosition()) {
            popup.setPosition(undefined); // Hide the popup
            map.removeOverlay(popup); // Remove the popup from the map
        }
    });
}

function viewMore(eventId) {
    console.log(`View more clicked for event: ${eventId}`);
    // Navigate to a detailed page or display more information
    window.location.href = `/events/${eventId}`;
}
