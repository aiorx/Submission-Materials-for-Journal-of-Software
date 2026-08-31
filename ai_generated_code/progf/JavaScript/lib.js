
const loadedPopups = [];

function qs(selector) {
  return document.querySelector(selector);
}
function fadingPopup(content = "An error has occured.") {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-text">${content}</div>
    </div>
  `;

  document.querySelector(".popup-wrapper").appendChild(popup);

  loadedPopups.push(popup);
  setTimeout(() => {
    popup.classList.add("popup-fade");
    setTimeout(() => {
      popup.remove();
    }, 1000);
    
    loadedPopups.splice(loadedPopups.indexOf(popup), 1);
  }, (6000 + (loadedPopups.length * 150)));
}

// thanks chatgpt
async function findProcessByName(processName) {
  let ret = [];
  try {
    const processes = await psList();

    const matchingProcesses = processes.filter(process => {
      return process.name && process.name.toLowerCase() === processName.toLowerCase();
    });

    if (matchingProcesses.length > 0) {
      console.log(`Found ${matchingProcesses.length} processes with the name "${processName}":`);
      matchingProcesses.forEach(match => {
        ret.push(match.pid);
      });
    } else {
      console.log(`No processes found with the name "${processName}".`);
    }
  } catch (err) {
    console.error('Error finding process by name:', err);
  }

  return ret;
}