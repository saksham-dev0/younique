# Task Maturity Test Application

A comprehensive task maturity assessment platform with user and admin authentication, built with Next.js and Supabase.

## Features

- **User Authentication**: Sign up and login with email/password
- **Admin Authentication**: Hardcoded admin credentials for dashboard access
- **Task Maturity Test**: 7 questions with 8 options each, 10 points distribution per question
- **Professional UI**: Clean, modern interface built with Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## Database Schema

The application uses the following Supabase tables:

- `admin` - Admin credentials (hardcoded)
- `users` - User accounts with name, email, password
- `test_questions` - 7 test questions
- `test_options` - 8 options per question
- `user_test_responses` - User responses with point distribution
- `user_test_sessions` - Completed test sessions

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `lib/database/schema.sql` in your Supabase SQL editor
3. This will create all necessary tables and insert sample data

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Default Admin Credentials

- **Admin ID**: `admin`
- **Password**: `admin123`

## User Flow

1. **Sign Up**: Users can create accounts with name, email, and password
2. **Login**: Users authenticate with email and password
3. **Take Test**: Users can take the 7-question task maturity test
4. **Point Distribution**: Each question requires exactly 10 points distributed across 8 options
5. **Results**: Admin can view all test results and user data

## Admin Flow

1. **Login**: Admin uses hardcoded credentials
2. **Dashboard**: View test statistics and user data
3. **Results**: Access all user test responses and scores

## Test Questions

The test includes 7 questions covering:

1. Task approach methodology
2. Work motivation factors
3. Deadline handling strategies
4. Communication preferences
5. Challenge resolution methods
6. Feedback preferences
7. Work prioritization styles

Each question has 8 options, and users must distribute exactly 10 points across these options.

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom implementation with localStorage
- **UI Components**: Radix UI primitives

## Project Structure

```
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   └── ui/            # Reusable UI components
├── lib/
│   ├── auth/          # Authentication logic
│   ├── contexts/      # React contexts
│   ├── database/      # Database schema
│   ├── supabase/      # Supabase client setup
│   └── types/         # TypeScript type definitions
└── pages/             # Next.js pages
```

## Development Notes

- Passwords are stored in plain text (for demo purposes)
- In production, implement proper password hashing
- Add proper error handling and validation
- Consider implementing proper session management
- Add test result analytics and reporting features