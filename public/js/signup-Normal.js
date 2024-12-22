document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect form fields
    const accountName = document.getElementById("account-name").value;
    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const dietaryNeeds = document.getElementById("dietary-needs").value;
    const mobility = document.getElementById("mobility").value;
    const mobilityIssues = document.getElementById("mobility-issues").value;

    // Check if the account name already exists
    const existingData = await getData();
    if (existingData) {
        const accountExists = Object.keys(existingData).some(key => key === accountName);
        if (accountExists) {
            alert("Account name already exists. Please choose a different account name.");
            return;
        }
    }

    // Post data to the server
    await postNormalUser({
        accountName,
        name,
        dob,
        phone,
        address,
        dietaryNeeds,
        mobility,
        mobilityIssues,
    });
});

async function postNormalUser({ accountName, name, dob, phone, address, dietaryNeeds, mobility, mobilityIssues }) {
    const url = "/signup";
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                path: "users",
                data: {
                    [accountName]: {
                        role: "normaluser",
                        name: name,
                        dob: dob,
                        phone: phone,
                        address: address,
                        dietaryNeeds: dietaryNeeds,
                        mobility: mobility,
                        mobilityIssues: mobilityIssues,
                    }
                }
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log("Response:", json);

        if (json.success) {
            const token = json.token;
            localStorage.setItem("authToken", token);
        }
    } catch (error) {
        console.error(error.message);
    }
}

// Fetch existing account data to validate uniqueness
async function getData() {
    const url = "/data";
    const params = new URLSearchParams({ path: "users" });
    try {
        const response = await fetch(`${url}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}
