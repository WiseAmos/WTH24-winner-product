document.getElementById('profile-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-image').src = e.target.result; // Set the image preview
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});
document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const accountName = document.getElementById("account-name").value;
    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const profileUpload = document.getElementById("profile-upload").files[0];

    let base64Image = null;

    // Convert the uploaded image to a base64 string
    if (profileUpload) {
        base64Image = await getBase64(profileUpload);
    }

    // Call the postVolunteer function
    await postVolunteer({
        accountName,
        image: base64Image,
        name,
        dob,
        email,
        phone,
        password,
    });
});

// Utility function to convert file to base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

async function getData() {
    const url = "/data";
    const params = new URLSearchParams({ path: "users" });
    try {
      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }
  
  document.addEventListener("DOMContentLoaded", getData);

async function postVolunteer({ accountName, image, name, dob, email, phone, password }) {
    const url = "/data";
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                path: "users",
                data: {
                    [accountName]: {
                        role: "volunteer",
                        image: image, // Base64 string
                        name: name,
                        dob: dob,
                        email: email,
                        phone: phone,
                        password: password
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
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}
