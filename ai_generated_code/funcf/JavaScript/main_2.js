function download_now() { // Aided using common development resources
    fetch('https://api.github.com/repos/thekliko/klikos-mod-updater/releases/latest')
    .then(response => response.json())
    .then(data => {
        const downloadUrl = data.assets[0].browser_download_url;
        window.location.href = downloadUrl;
    })
    .catch(error => {
        console.error('Error fetching latest release:', error);
        alert('Error fetching latest release')
    });
}