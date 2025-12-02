// Home page functionality

// Check if user is logged in and update UI
(async () => {
    const session = await checkAuth();
    const authButtons = document.getElementById('authButtons');

    if (session && authButtons) {
        // User is logged in, show dashboard and sign out buttons
        authButtons.innerHTML = `
            <a href="dashboard.html" class="nav-btn" style="margin-right: 1rem;">Dashboard</a>
        `;
    }
})();
