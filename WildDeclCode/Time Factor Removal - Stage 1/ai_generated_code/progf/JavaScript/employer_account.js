// Code Assisted with basic coding tools

document.addEventListener('DOMContentLoaded', function () {
    // Check if the employer is already logged in
    checkAuthentication();
});

// Function to check if the employer is logged in
async function checkAuthentication() {
    try {
        var response = await fetch('/check-auth');
        if (response.status === 200) {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('registerSection').style.display = 'none';
            document.getElementById('profileSection').style.display = 'block';
            loadProfile();
        } else {
            document.getElementById('loginSection').style.display = 'block';
            document.getElementById('registerSection').style.display = 'block';
            document.getElementById('profileSection').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}

// Registration Functionality
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    var name = document.getElementById('registerName').value;
    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPassword').value;

    try {
        var response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        var data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.reload();
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Error registering:', error);
    }
});

// Login Functionality
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;

    try {
        var response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        var data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.reload();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
});

// Load Profile Information
async function loadProfile() {
    try {
        var response = await fetch('/check-auth');
        var data = await response.json();
        if (response.ok) {
            document.getElementById('profileName').value = data.name;
            document.getElementById('profileEmail').value = data.email;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update Profile Functionality
document.getElementById('profileForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    var name = document.getElementById('profileName').value;

    try {
        var response = await fetch('/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
            credentials: 'include'
        });

        var data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.error || 'Profile update failed');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
});

// Logout Functionality
document.getElementById('logoutButton').addEventListener('click', async function () {
    try {
        var response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            alert('Logged out successfully');
            window.location.reload();
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
});
