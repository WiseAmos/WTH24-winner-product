document.getElementById('createForm').addEventListener('submit', function (e) {
    e.preventDefault();     
    const requestData = getInput();
    if (requestData) { // Proceed only if requestData is valid
        postData(requestData);
    }
});


function getInput() {

    // Get values from the form
    const detail = document.getElementById('Detail').value;
    const location = document.getElementById('location').value;
    const time = document.getElementById('Time').value;
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
    alert('Request created successfully!');

    return requestData;
}

async function postData(requestData) {
    const url = "/data";
    try {
        const response = await fetch("/data", {
            method: "POST",
            body: JSON.stringify({
                path:"specialRequests",
                data: {
                details: requestData.detail,
                location: requestData.location,
                time: requestData.time,
                date: requestData.date,
                type: requestData.type,
                timeStamp: new Date().toISOString(),
                createdBy: "random_person",
                status: "Pending"
                }
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
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

