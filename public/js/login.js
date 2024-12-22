document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the form
    const accountName = document.getElementById("account-name").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!accountName || !password) {
        alert("Both account name and password are required.");
        return;
    }

    // Call the login function
    await login({ accountName, password });
});

async function login({ accountName, password }) {
    const url = "/login"; 
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                accountName: accountName,
                password: password
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
            alert("Login successful!");
            const token = json.token; 
            console.log("JWT Token:", token);

            
            localStorage.setItem("authToken", token);

          
            window.location.href = "#"; 
        } else {
            alert(json.message || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error.message);
        alert("An error occurred. Please try again later.");
    }
}
