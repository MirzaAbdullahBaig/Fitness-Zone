# Supabase Authentication Setup Guide

Is guide ko follow karke aap apne Fitness Zone gym management project mein Supabase authentication setup kar sakte hain.

## 1. Supabase Account Setup

### Step 1: Supabase Account Banayein
1. [Supabase Website](https://supabase.com) par jayein
2. "Start your project" button par click karein
3. GitHub se sign up karein ya email se account banayein

### Step 2: New Project Create Karein
1. Dashboard mein "New Project" par click karein
2. Organization select karein (ya naya banayein)
3. Project details fill karein:
   - **Project Name**: fitness-zone (ya koi bhi naam)
   - **Database Password**: Strong password (is ko yaad rakhein!)
   - **Region**: Apne nearest region select karein (jaise Singapore for Pakistan)
   - **Pricing Plan**: Free tier select karein
4. "Create new project" button par click karein
5. Project setup hone ka wait karein (1-2 minute lagta hai)

## 2. API Keys Copy Karein

### Step 1: Project Settings Mein Jayein
1. Left sidebar mein **Settings** icon (gear icon) par click karein
2. **API** section par click karein

### Step 2: API Keys Copy Karein
Aapko 2 values chahiye hongi:

1. **Project URL**:
   - "Project URL" section mein milega
   - Format: `https://xxxxxxxxxxxxx.supabase.co`
   - Is ko copy karein

2. **Anon/Public Key**:
   - "Project API keys" section mein
   - "anon public" key ko copy karein
   - Ye bahut lamba string hoga

## 3. Project Mein API Keys Add Karein

### File: `js/supabase-config.js`

File open karein aur ye values replace karein:

```javascript
// Replace these values:
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Example (aapki values different hongi):
const SUPABASE_URL = 'https://abcdefgh12345678.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Important**: Quotes ke andar apni actual values paste karein!

## 4. Optional: User Profiles Table Setup

Agar aap additional user information store karna chahte hain (recommended), to ye SQL query run karein:

### Step 1: SQL Editor Mein Jayein
1. Supabase Dashboard mein left sidebar se **SQL Editor** par click karein
2. "New query" button par click karein

### Step 2: Ye SQL Query Copy aur Run Karein

```sql
-- User profiles table banayein
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

-- Index banayein taake queries fast ho
CREATE INDEX user_profiles_user_id_idx ON user_profiles(user_id);

-- Row Level Security (RLS) enable karein
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users apna data read kar sakte hain
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users apna data insert kar sakte hain
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users apna data update kar sakte hain
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Function banayein jo automatically updated_at field update kare
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger banayein
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Query Run Karein
- "Run" button par click karein ya `Ctrl+Enter` press karein
- Success message aana chahiye

**Note**: Agar aap ye table nahi banate, to bhi authentication kaam karega, lekin user ka first name, last name aur phone auth metadata mein hi store hoga.

## 5. Email Settings Configure Karein (Optional but Recommended)

### Default Email Settings
Supabase default email provider use karta hai development ke liye, lekin production mein apna email provider use karein.

### Step 1: Authentication Settings
1. Dashboard mein **Authentication** > **Settings** par jayein
2. "Email" section mein:
   - **Enable Email Signup**: ON rakhen
   - **Confirm Email**: ON rakhen (verification ke liye)
   - **Secure Email Change**: ON rakhen

### Step 2: Email Templates (Optional)
1. **Authentication** > **Email Templates** par jayein
2. Confirmation email template customize kar sakte hain

## 6. Testing Karein

### Step 1: Project Run Karein
1. `index.html` file ko browser mein open karein
2. Ya live server use karein:
   ```bash
   # VS Code mein Live Server extension install karein
   # Right click on index.html > Open with Live Server
   ```

### Step 2: Sign Up Test Karein
1. "Sign Up" button par click karein
2. Form fill karein:
   - First Name: Test naam
   - Last Name: Test surname
   - Email: Valid email
   - Phone: 11 digit number (e.g., 03001234567)
   - Password: Minimum 6 characters
3. "Create Account" button par click karein
4. Success message aana chahiye

### Step 3: Email Verify Karein
1. Apne email inbox check karein
2. Supabase se verification email aayegi
3. "Confirm your mail" link par click karein

### Step 4: Sign In Test Karein
1. Sign In page par jayein
2. Email aur password enter karein
3. Dashboard par redirect hona chahiye

## 7. Troubleshooting

### Error: "Invalid API key"
- Check karein ke aapne correct API key copy ki hai
- Quotes ke andar properly paste ki hai
- Koi extra spaces nahi hain

### Error: "Invalid login credentials"
- Email verify kiya hai?
- Password correct hai?
- Signup successful hua tha?

### Error: "Network request failed"
- Internet connection check karein
- Supabase URL correct hai?
- CORS issue ho sakta hai - file:// protocol ki bajaye http:// use karein

### Users Table Check Karein
1. Dashboard > **Authentication** > **Users** par jayein
2. Registered users dikhne chahiye

### Profiles Table Check Karein (agar banaya hai)
1. Dashboard > **Table Editor** par jayein
2. `user_profiles` table select karein
3. User data dikhna chahiye

## 8. Security Best Practices

### 1. API Keys Protection
- **KABHI BHI** API keys ko Git/GitHub par upload na karein
- `.gitignore` file banayein:
  ```
  js/supabase-config.js
  ```

### 2. Row Level Security (RLS)
- Database tables par RLS enable zaroor karein
- Bina RLS ke, data public accessible hoga

### 3. Password Policies
Supabase mein default password requirements:
- Minimum 6 characters
- Aap stronger requirements set kar sakte hain Authentication settings mein

### 4. Rate Limiting
Supabase automatically rate limiting provide karta hai, lekin production mein:
- Custom rate limiting add karein
- Captcha add karein signup form mein

## 9. Next Steps

### Features Add Kar Sakte Hain:
1. **Password Reset**: Forgot password functionality
2. **Profile Update**: User profile edit karne ki facility
3. **Email Change**: Email update functionality
4. **Phone Verification**: SMS verification add karein
5. **Social Login**: Google/Facebook login add karein
6. **2FA**: Two-factor authentication add karein

### Database Tables Banayein:
- Attendance tracking table
- Membership plans table
- Payment records table
- Workout logs table

## Support

Agar koi problem ho to:
1. [Supabase Documentation](https://supabase.com/docs) check karein
2. [Supabase Discord](https://discord.supabase.com) par help mangein
3. Is project ki files check karein comments ke liye

---

## Quick Reference

### Important Files:
- **js/supabase-config.js** - API keys yahaan add karein
- **js/auth.js** - Authentication functions
- **signup.html** - Signup page
- **signin.html** - Signin page
- **dashboard.html** - User dashboard

### Important Links:
- Supabase Dashboard: https://app.supabase.com
- Your Project: [Add your project URL here]

Good luck! 🚀
