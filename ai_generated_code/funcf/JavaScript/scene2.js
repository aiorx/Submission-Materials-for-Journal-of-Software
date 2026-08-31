```js
// this pop-up was Built via standard programming aids
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999';
  document.body.appendChild(overlay);

  // Create popup
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '30%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = 'white';
  popup.style.border = '2px solid #333';
  popup.style.padding = '40px';
  popup.style.zIndex = '1000';
  popup.style.textAlign = 'center';
  popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  
  // Add image
  const img = document.createElement('img');
  img.src = 'glasses.png';
  img.alt = 'Glasses';
  img.style.maxWidth = '500px';
  popup.appendChild(img);

  // Add close button
  const button = document.createElement('button');
  button.textContent = 'Close';
  button.style.marginTop = '10px';
  button.onclick = () => {
    document.body.removeChild(popup);
    document.body.removeChild(overlay);
  };
  popup.appendChild(document.createElement('br'));
  popup.appendChild(button);

  document.body.appendChild(popup);
```