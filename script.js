// Check authentication and update UI
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DOM loaded, checking elements...');
    
    updateAuthUI();
    
    const form = document.getElementById('complaintForm');
    console.log('📋 Form element found:', form);
    
    if (!form) {
        console.error('❌ Form element not found!');
        return;
    }
    
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');
    const successMessage = form.querySelector('.success-message');
    
    console.log('🔘 Submit button found:', submitBtn);
    console.log('📝 Button text found:', btnText);
    console.log('🔄 Loading spinner found:', loadingSpinner);
    console.log('✅ Success message found:', successMessage);
    
    // Check if user is authenticated before allowing complaint submission
    function checkAuthentication() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Redirect to login with return URL
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `login.html?redirect=${currentUrl}`;
            return false;
        }
        return true;
    }
    
    // Update authentication UI
    function updateAuthUI() {
        const authLinks = document.getElementById('authLinks');
        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        
        if (token && userEmail) {
            // User is logged in
            authLinks.innerHTML = `
                <a href="dashboard.html" style="color: #f5f5f7;">Dashboard</a>
                <a href="#" onclick="logout()" style="color: #f5f5f7;">Logout</a>
            `;
        } else {
            // User is not logged in - show simple login link
            authLinks.innerHTML = `
                <a href="login.html" style="color: #0071e3; text-decoration: none; font-weight: 500;">Login</a>
            `;
        }
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        window.location.reload();
    }
    
    // Form validation rules
    const validators = {
        fullName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s\-\.']+$/,
            message: 'Please enter a valid full name (minimum 2 characters)'
        },
        phoneNumber: {
            required: true,
            pattern: /^[\d\s\-\(\)]+$/,
            message: 'Please enter a valid phone number'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        appleId: {
            required: false,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid Apple ID email address'
        },
        complaintType: {
            required: true,
            message: 'Please select a complaint type'
        },
        complaintDescription: {
            required: true,
            minLength: 10,
            message: 'Please provide a detailed description (minimum 10 characters)'
        },
        recaptcha: {
            required: true,
            custom: (field) => field.checked,
            message: 'Please confirm you are not a robot'
        }
    };
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Only validate inputs that have names and corresponding validators
        if (!input.name || !validators[input.name]) {
            return;
        }
        
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            // Special handling for phone number - only allow digits
            if (input.id === 'phoneNumber') {
                input.value = input.value.replace(/\D/g, '').slice(0, 10);
            }
            if (input.parentElement.classList.contains('error')) {
                validateField(input);
            }
            checkFormValidity();
        });
        
        // Special handling for checkbox - validate on click
        if (input.type === 'checkbox') {
            input.addEventListener('click', () => {
                validateField(input);
                checkFormValidity();
            });
        }
    });
    
    // Field validation
    function validateField(field) {
        const fieldName = field.name;
        const isCheckbox = field.type === 'checkbox';
        const value = isCheckbox ? field.checked : field.value.trim();
        const validator = validators[fieldName];
        const formGroup = field.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (!validator) return true;
        
        // Reset error state only if error message element exists
        if (errorMessage) {
            formGroup.classList.remove('error');
            errorMessage.textContent = '';
        }
        
        // Check if required and empty
        if (validator.required && !value) {
            let labelText = field.previousElementSibling ? field.previousElementSibling.textContent.replace(' *', '') : fieldName;
            if (isCheckbox) {
                labelText = field.parentElement.querySelector('label').textContent.replace(' *', '');
            }
            if (errorMessage) {
                showError(formGroup, errorMessage, `${labelText} is required`);
            }
            return false;
        }
        
        // Skip validation for optional fields that are empty
        if (!validator.required && !value) {
            return true;
        }
        
        // Pattern validation (only for non-checkbox fields)
        if (validator.pattern && !isCheckbox && value && !validator.pattern.test(value)) {
            if (errorMessage) {
                showError(formGroup, errorMessage, validator.message);
            }
            return false;
        }
        
        // Minimum length validation (only for non-checkbox fields)
        if (validator.minLength && !isCheckbox && value.length < validator.minLength) {
            if (errorMessage) {
                showError(formGroup, errorMessage, validator.message);
            }
            return false;
        }
        
        // Custom validation
        if (validator.custom && !validator.custom(field)) {
            if (errorMessage) {
                showError(formGroup, errorMessage, validator.message);
            }
            return false;
        }
        
        return true;
    }
    
    function showError(formGroup, errorMessage, message) {
        if (formGroup && errorMessage) {
            formGroup.classList.add('error');
            errorMessage.textContent = message;
        }
    }
    
    // Check form validity
    function checkFormValidity() {
        let isValid = true;
        
        inputs.forEach(input => {
            // Only validate inputs that have names and corresponding validators
            if (!input.name || !validators[input.name]) {
                return;
            }
            
            const fieldValid = validateField(input);
            if (!fieldValid) {
                isValid = false;
            }
        });
        
        submitBtn.disabled = !isValid;
        return isValid;
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🚀 Form submission started');
        
        if (!checkFormValidity()) {
            console.log('❌ Form validation failed');
            return;
        }
        
        console.log('✅ Form validation passed');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'block';
        
        try {
            console.log('📡 Collecting form data');
            const formData = new FormData(form);
            const data = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phoneNumber: formData.get('phoneNumber'),
                appleId: formData.get('appleId'),
                complaintType: formData.get('complaintType'),
                complaintDescription: formData.get('complaintDescription'),
                recaptcha: formData.get('recaptcha') === 'on'
            };
            
            console.log('📋 Form data collected:', data);
            
            console.log('📡 Making API request to /api/complaints');
            
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
            });
            
            const response = await Promise.race([
                fetch('/api/complaints', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }),
                timeoutPromise
            ]);
            
            console.log('📡 Response received:', response.status, response.ok);
            console.log('📡 Response headers:', response.headers);
            
            const result = await response.json();
            console.log('📋 Response data:', result);
            console.log('📋 userCredentials exists:', !!result.userCredentials);
            console.log('📋 userCredentials value:', result.userCredentials);
            console.log('📋 userCredentials type:', typeof result.userCredentials);
            
            // Show success message with user credentials if new user
            let successText = `Complaint submitted successfully! Your tracking number is: ${result.trackingNumber}`;
            
            if (result.userCredentials) {
                successText += `<br><br><strong>Account Created!</strong><br>\n                Your login credentials:<br>\n                <strong>Email:</strong> ${result.userCredentials.email}<br>\n                <strong>Password:</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">${result.userCredentials.password}</code><br><br>\n                <em>Save these credentials to track your complaint status and manage your support requests.</em><br>\n                <a href="login.html" style="color: #0071e3; text-decoration: none; font-weight: 600;">Login to Dashboard →</a>`;
            } else {
                // Fallback: Show credentials even if userCredentials is not properly detected
                successText += `<br><br><strong>Your Login Credentials:</strong><br>\n                <strong>Email:</strong> ${result.userId ? 'Existing User' : 'Check server logs'}<br>\n                <strong>Password:</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">Check server logs</code><br><br>\n                <em>Please contact support if credentials not displayed.</em>`;
            }
            
            console.log('✅ Success text:', successText);
            console.log('✅ Success message element:', successMessage);
            successMessage.innerHTML = successText;
            successMessage.style.display = 'block';
            console.log('✅ Success message display set to block');
            form.reset();
            
            // Reset submit button after showing success
            setTimeout(() => {
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                loadingSpinner.style.display = 'none';
            }, 1000);
            
            // Don't hide success message if user credentials were shown
            if (!result.userCredentials) {
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            } else {
                // Keep success message visible if credentials are shown
                // User can manually close it or navigate away
            }
            
        } catch (error) {
            console.error('❌ Error submitting complaint:', error);
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message show';
            errorDiv.textContent = 'Failed to submit complaint. Please try again.';
            form.insertBefore(errorDiv, submitBtn);
            
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            loadingSpinner.style.display = 'none';
        }
    });
    
    // Initialize form validity check
    checkFormValidity();
});

// Utility functions
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
}

// Rate limiting
const rateLimiter = {
    attempts: 0,
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lastReset: Date.now(),
    
    isAllowed() {
        const now = Date.now();
        if (now - this.lastReset > this.windowMs) {
            this.attempts = 0;
            this.lastReset = now;
        }
        
        return this.attempts < this.maxAttempts;
    },
    
    recordAttempt() {
        this.attempts++;
    }
};
