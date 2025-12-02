# Fitness Zone - Gym Management System with Supabase Authentication

Ye ek complete gym management website hai with Supabase authentication integration.

## Features

### Authentication Features:
- **Sign Up**: First name, Last name, Email, Password, aur 11-digit phone number validation
- **Sign In**: Email aur password se login
- **Sign Out**: Secure logout functionality
- **Dashboard**: User profile information display
- **Protected Routes**: Bina login ke dashboard access nahi ho sakta
- **Form Validation**: Real-time validation with error messages
- **Responsive Design**: Mobile-friendly UI

### Gym Features:
- Services showcase
- Membership plans (Basic, Pro, Premium)
- Attendance tracking section
- Client reviews
- Professional landing page

## Project Structure

```
RajaProject2/
│
├── index.html              # Main landing page
├── signup.html             # User registration page
├── signin.html             # User login page
├── dashboard.html          # User dashboard (protected)
├── style.css               # Main website styles
│
├── css/
│   └── auth.css           # Authentication pages styles
│
├── js/
│   ├── supabase-config.js # Supabase configuration (ADD YOUR API KEYS HERE)
│   ├── auth.js            # Authentication utility functions
│   ├── signup.js          # Signup page logic
│   ├── signin.js          # Signin page logic
│   ├── dashboard.js       # Dashboard page logic
│   └── home.js            # Home page auth status check
│
├── pics/                   # Image assets
│
├── SUPABASE_SETUP.md      # Complete setup guide
└── README.md              # This file
```

## Setup Instructions

### 1. Supabase Setup

**IMPORTANT**: Pehle Supabase account banayein aur project setup karein!

Detailed instructions ke liye `SUPABASE_SETUP.md` file dekhen.

Quick steps:
1. [Supabase](https://supabase.com) par account banayein
2. New project create karein
3. API keys copy karein:
   - Project URL
   - Anon/Public key

### 2. API Keys Configuration

`js/supabase-config.js` file open karein aur apni API keys add karein:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';  // Apna Project URL yahaan paste karein
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';  // Apni Anon key yahaan paste karein
```

### 3. Optional: User Profiles Table

User ka additional information store karne ke liye Supabase SQL editor mein ye query run karein:

```sql
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX user_profiles_user_id_idx ON user_profiles(user_id);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);
```

Complete SQL script `SUPABASE_SETUP.md` mein hai.

### 4. Run the Project

#### Option 1: Live Server (Recommended)
1. VS Code mein Live Server extension install karein
2. `index.html` par right-click karein
3. "Open with Live Server" select karein

#### Option 2: Direct Browser
1. `index.html` file ko browser mein open karein
2. **Note**: Kuch features file:// protocol mein kaam nahi karenge, HTTP server use karein

## How to Use

### Sign Up Process:
1. Homepage par "Sign Up" button click karein
2. Form fill karein:
   - **First Name**: Minimum 2 characters
   - **Last Name**: Minimum 2 characters
   - **Email**: Valid email format
   - **Phone**: Exactly 11 digits (e.g., 03001234567)
   - **Password**: Minimum 6 characters
   - **Confirm Password**: Must match password
3. "Create Account" button click karein
4. Email inbox check karein for verification link
5. Email verify karein

### Sign In Process:
1. "Sign In" page par jayein
2. Email aur password enter karein
3. "Sign In" button click karein
4. Dashboard par redirect ho jayenge

### Dashboard:
- User profile information display hogi
- Quick action cards (Services, Membership, Attendance)
- Stats section
- Sign Out button

## Form Validations

### Signup Form:
- **First Name**: Required, minimum 2 characters
- **Last Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Phone**: Required, exactly 11 digits, numbers only
- **Password**: Required, minimum 6 characters
- **Confirm Password**: Required, must match password

### Signin Form:
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters

Real-time validation with error messages!

## Authentication Flow

```
1. User visits website (index.html)
   ↓
2. Click "Sign Up"
   ↓
3. Fill signup form → Validation → Supabase signup
   ↓
4. Email verification
   ↓
5. Sign In with credentials
   ↓
6. Redirect to Dashboard
   ↓
7. View profile, access features
   ↓
8. Sign Out → Return to home
```

## Security Features

1. **Password Security**: Supabase handles password hashing
2. **Email Verification**: Users must verify email
3. **Row Level Security**: Users can only access their own data
4. **Protected Routes**: Dashboard requires authentication
5. **Session Management**: Automatic session handling
6. **Input Validation**: Client-side and server-side validation

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3 (Custom styling + responsive design)
  - Vanilla JavaScript
  - Boxicons for icons

- **Backend/Database**:
  - Supabase (PostgreSQL database)
  - Supabase Auth (Authentication)
  - Supabase JS SDK v2

## File Descriptions

### HTML Files:
- **index.html**: Main landing page with gym information
- **signup.html**: User registration form
- **signin.html**: User login form
- **dashboard.html**: Protected user dashboard

### CSS Files:
- **style.css**: Main website styling
- **css/auth.css**: Authentication pages styling (forms, buttons, messages)

### JavaScript Files:
- **js/supabase-config.js**: Supabase initialization (ADD YOUR KEYS HERE!)
- **js/auth.js**: Authentication helper functions
- **js/signup.js**: Signup page functionality
- **js/signin.js**: Signin page functionality
- **js/dashboard.js**: Dashboard page functionality
- **js/home.js**: Home page auth state management

## Common Issues & Solutions

### Issue 1: "Invalid API key" error
**Solution**: Check ke aapne correct API keys `js/supabase-config.js` mein add ki hain

### Issue 2: Users table mein data nahi aa raha
**Solution**:
1. Supabase Dashboard > Authentication > Users check karein
2. Email verification confirm karein
3. Console errors check karein

### Issue 3: CORS errors
**Solution**: File:// protocol ki bajaye HTTP server use karein (Live Server)

### Issue 4: Profile data nahi dikh raha
**Solution**:
- `user_profiles` table create kiya hai? (Optional table)
- Table create nahi hai to user_metadata se data aayega

### Issue 5: Email nahi aa rahi
**Solution**:
1. Spam folder check karein
2. Supabase email settings check karein
3. Test email provider ki limitations check karein

## Future Enhancements

Possible features to add:
- [ ] Forgot password functionality
- [ ] Profile edit/update
- [ ] Change password
- [ ] Upload profile picture
- [ ] Attendance tracking system
- [ ] Membership payment integration
- [ ] Workout plans
- [ ] Trainer assignment
- [ ] Class scheduling
- [ ] Admin panel
- [ ] Reports and analytics

## Support

Agar koi problem ho ya questions hon:
1. `SUPABASE_SETUP.md` complete guide check karein
2. Supabase documentation: https://supabase.com/docs
3. Console errors check karein (F12 > Console)
4. Network tab check karein API calls ke liye

## License

Free to use for educational and personal projects.

## Credits

Created for Fitness Zone Gym Management System
Powered by Supabase

---

**Happy Coding! 🚀💪**
