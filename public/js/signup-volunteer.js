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

