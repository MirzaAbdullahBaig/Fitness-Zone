// Authentication utility functions

// Check if user is authenticated
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return session;
}

// Check if user is logged in and redirect if not
async function requireAuth() {
    const session = await checkAuth();
    if (!session) {
        window.location.href = 'signin.html';
        return null;
    }
    return session;
}

// Check if user is logged in and redirect to dashboard if yes
async function redirectIfAuthenticated() {
    const session = await checkAuth();
    if (session) {
        window.location.href = 'dashboard.html';
    }
}

// Sign up function
async function signUp(firstName, lastName, email, phone, password) {
    try {
        // Sign up the user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone
                }
            }
        });

        if (signUpError) throw signUpError;

        // If signup successful, store additional user info in a custom table
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('user_profiles')
                .insert([
                    {
                        user_id: authData.user.id,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        phone: phone
                    }
                ]);

            // Note: If user_profiles table doesn't exist, this will fail
            // but the user will still be created in auth.users
            if (profileError) {
                console.warn('Profile creation failed:', profileError.message);
            }
        }

        return { success: true, data: authData };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign in function
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        return { success: true, data: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign out function
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get current user
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting user:', error.message);
        return null;
    }
}

// Get user profile from custom table
async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error getting profile:', error.message);
        return null;
    }
}

// Validate phone number (11 digits)
function validatePhone(phone) {
    const phoneRegex = /^[0-9]{11}$/;
    return phoneRegex.test(phone);
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message helper
function showMessage(elementId, message, type = 'error') {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Show error on input field
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Clear all field errors
function clearFieldErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// Toggle button loading state
function toggleButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');

        if (isLoading) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            button.disabled = true;
        } else {
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            button.disabled = false;
        }
    }
}
