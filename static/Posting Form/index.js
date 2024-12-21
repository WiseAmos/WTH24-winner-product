
const food = JSON.parse(sessionStorage.getItem("previouslyClicked"))[0]
console.log(food)
document.addEventListener("DOMContentLoaded",()=>{
    const button = document.getElementById("sign-up")
    console.log(button)
    document.getElementById("image-banner").src = food["image"]
    document.getElementById("title").innerText = food["title"]
    document.getElementById("about").innerText = food["description"]
    document.getElementById("date").innerText = food["date"]
    document.getElementById("time").innerText = food["time"]
    console.log(getData("announcements"))
    button.addEventListener("click",()=>{
<<<<<<< HEAD
        postData("data/food","" )
=======
        postData("annoucements\\"+food["createdBy"],)
>>>>>>> 678fe3e1d420908c57f2a1231e90d6df7daf4b92
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
  
  // Example usage: update the progress bar dynamically
  setTimeout(() => updateProgress(5, 10), 10); // Updates to 8/10 after 1 second
  

  async function getData(path) {
    const url = "/data";
    try {
      const response = await fetch(url+"?path="+path);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

<<<<<<< HEAD
  // getData()
=======
>>>>>>> 678fe3e1d420908c57f2a1231e90d6df7daf4b92


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

<<<<<<< HEAD
  // postData()
=======
>>>>>>> 678fe3e1d420908c57f2a1231e90d6df7daf4b92
