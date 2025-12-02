// Signup page functionality

// Redirect if already authenticated
redirectIfAuthenticated();

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearFieldErrors();
    document.getElementById('message').style.display = 'none';

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    let hasError = false;

    if (firstName.length < 2) {
        showFieldError('firstName', 'First name must be at least 2 characters');
        hasError = true;
    }

    if (lastName.length < 2) {
        showFieldError('lastName', 'Last name must be at least 2 characters');
        hasError = true;
    }

    if (!validateEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasError = true;
    }

    if (!validatePhone(phone)) {
        showFieldError('phone', 'Please enter a valid 11 digit phone number');
        hasError = true;
    }

    if (password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        hasError = true;
    }

    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        hasError = true;
    }

    if (hasError) return;

    // Show loading state
    toggleButtonLoading('signupBtn', true);

    // Attempt signup
    const result = await signUp(firstName, lastName, email, phone, password);

    // Hide loading state
    toggleButtonLoading('signupBtn', false);

    if (result.success) {
        showMessage('message', 'Account created successfully! Please check your email to verify your account. Redirecting to signin...', 'success');

        // Redirect to signin after 3 seconds
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 3000);
    } else {
        showMessage('message', result.error || 'Failed to create account. Please try again.', 'error');
    }
});

// Real-time validation for phone number
document.getElementById('phone').addEventListener('input', (e) => {
    const phone = e.target.value;
    // Remove non-numeric characters
    e.target.value = phone.replace(/[^0-9]/g, '');

    // Clear error if valid
    if (validatePhone(e.target.value)) {
        document.getElementById('phoneError').style.display = 'none';
    }
});

// Password match validation
document.getElementById('confirmPassword').addEventListener('input', (e) => {
    const password = document.getElementById('password').value;
    const confirmPassword = e.target.value;

    if (confirmPassword && password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
    } else {
        document.getElementById('confirmPasswordError').style.display = 'none';
    }
});
