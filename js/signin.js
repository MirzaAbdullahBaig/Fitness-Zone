// Signin page functionality

// Redirect if already authenticated
redirectIfAuthenticated();

// Handle signin form submission
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearFieldErrors();
    document.getElementById('message').style.display = 'none';

    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    let hasError = false;

    if (!validateEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasError = true;
    }

    if (password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        hasError = true;
    }

    if (hasError) return;

    // Show loading state
    toggleButtonLoading('signinBtn', true);

    // Attempt signin
    const result = await signIn(email, password);

    // Hide loading state
    toggleButtonLoading('signinBtn', false);

    if (result.success) {
        showMessage('message', 'Login successful! Redirecting...', 'success');

        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showMessage('message', result.error || 'Invalid email or password. Please try again.', 'error');
    }
});
