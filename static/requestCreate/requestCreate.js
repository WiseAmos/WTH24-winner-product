document.getElementById('createForm').addEventListener('submit', function (e) {
    e.preventDefault();     
    const requestData = getInput();
    if (requestData) { // Proceed only if requestData is valid
        postData(requestData);
    }
});

function decodeJWT(token) {
    if (!token) {
        console.error("No token provided for decoding.");
        return null;
    }

    try {
        const [header, payload, signature] = token.split('.');
        const decodedHeader = JSON.parse(atob(header));
        const decodedPayload = JSON.parse(atob(payload));

        return { decodedHeader, decodedPayload, signature };
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}


function getInput() {

    // Get values from the form
    const detail = document.getElementById('Detail').value;
    const location = document.getElementById('location').value;
    const startTime = document.getElementById('StartTime').value.replace(':', '');
    const endTime = document.getElementById('EndTime').value.replace(':', '');
    const time = `${startTime} - ${endTime}`;
    const date = document.getElementById('Date').value;
    const type = document.getElementById('Type').value;

    // Validate input (optional)
    if (!detail || !location || !time || !date || !type) {
        alert('All fields are required!');
        return;
    }

    // Create an object with the form data
    const requestData = {
        detail,
        location,
        time,
        date,
        type
    };

    // Log the data to the console or send it to a server
    console.log('Request Data:', requestData);

    // Example: Display a success message
    // alert('Request created successfully!');

    return requestData;
}

async function postData(requestData) {
    const url = "/data";
    const token = localStorage.getItem("authToken");
    const decodedToken = decodeJWT(token); // Decode the JWT token

    if (!decodedToken || !decodedToken.decodedPayload) {
        alert("Please Login to Create a Request");
        return;
    }

    try {
        const uniqueKey = Date.now().toString();

        const response = await fetch("/data", {
            method: "POST",
            body: JSON.stringify({
                path:"specialRequests",
                data: {
                    [uniqueKey]: {
                details: requestData.detail,
                location: requestData.location,
                time: requestData.time,
                date: requestData.date,
                type: requestData.type,
                timeStamp: new Date().toISOString(),
                createdBy: decodedToken.decodedPayload.accountName,
                status: "Pending"
                }
            }
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        alert('Request created successfully!');
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}

