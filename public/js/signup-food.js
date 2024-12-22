document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const accountName = document.getElementById("account-name").value;
    const organizationName = document.getElementById("org-name").value;
    const representativeName = document.getElementById("rep-name").value;
    const designation = document.getElementById("rep-designation").value;
    const dob = document.getElementById("rep-dob").value;
    const email = document.getElementById("rep-email").value;
    const phone = document.getElementById("rep-phone").value;
    const password = document.getElementById("password").value;
    const location = document.getElementById("location").value;
    const about = document.getElementById("about").value;

    // Check if the account name already exists
    const existingData = await getData();
    if (existingData) {
        const accountExists = Object.keys(existingData).some(key => key === accountName);
        if (accountExists) {
            alert("Account name already exists. Please choose a different account name.");
            return;
        }
    }

    // Post food stall data
    await postFoodStall({
        accountName,
        organizationName,
        representativeName,
        designation,
        dob,
        email,
        phone,
        location,
        about,
        password,
    });

    window.location.href = "/organisation";
});

async function postFoodStall({ accountName, organizationName, representativeName, designation, dob, email, phone, location, about, password }) {
    const url = "/signup";
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                path: "users",
                data: {
                    [accountName]: {
                        role: "foodstall",
                        organizationName: organizationName,
                        representativeName: representativeName,
                        designation: designation,
                        dob: dob,
                        email: email,
                        phone: phone,
                        location: location,
                        about: about,
                        password: password,
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
