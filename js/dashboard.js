// Dashboard page functionality

// Check authentication on page load
(async () => {
    const session = await requireAuth();
    if (!session) return;

    // Load user data
    await loadUserData();
})();

// Load and display user data
async function loadUserData() {
    const user = await getCurrentUser();

    if (user) {
        // Display user metadata
        const firstName = user.user_metadata?.first_name || '';
        const lastName = user.user_metadata?.last_name || '';
        const phone = user.user_metadata?.phone || 'Not provided';
        const email = user.email || '';
        const createdAt = new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        document.getElementById('userName').textContent = `${firstName} ${lastName}`;
        document.getElementById('userEmail').textContent = email;
        document.getElementById('userPhone').textContent = phone;
        document.getElementById('memberSince').textContent = createdAt;

        // Try to get profile from custom table if exists
        try {
            const profile = await getUserProfile(user.id);
            if (profile) {
                document.getElementById('userName').textContent = `${profile.first_name} ${profile.last_name}`;
                document.getElementById('userPhone').textContent = profile.phone;
            }
        } catch (error) {
            console.log('Profile table not found or error:', error);
        }
    }
}

// Handle sign out
document.getElementById('signoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();

    const confirmed = confirm('Are you sure you want to sign out?');
    if (confirmed) {
        await signOut();
    }
});
