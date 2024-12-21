

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
  

  async function getData() {
    const url = "/data";
    try {
      const response = await fetch(url+"?path=users");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  getData()