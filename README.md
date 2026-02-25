# 🎬 MovieApp

A production-style full-stack media dashboard built with React, Node.js, and MongoDB, implementing secure JWT authentication with refresh token rotation and third-party API integration (TMDB).

This project demonstrates strong backend architecture, secure session management, RESTful API design, and real-world authentication patterns used in enterprise applications.

# 🚀 Project Highlights

Implemented Refresh Token Rotation with reuse detection to mitigate XSS and token theft attacks

Designed a database-backed session management system with token hashing and session limits

Built a secure REST API with structured error handling and middleware architecture

Integrated and normalized data from an external API (TMDB) with pagination and rate-limit handling

Developed protected frontend routing with seamless silent authentication recovery

Enforced max concurrent user sessions (3 per user) with absolute expiry logic.

# 🔐 Authentication & Security Architecture

## Dual-Token Strategy
Short-lived Access Token (5 min) stored in memory (React state)

Long-lived Refresh Token (7 days) stored as httpOnly secure cookie

Eliminated localStorage token storage to prevent XSS exposure

## Refresh Token Rotation
On token expiry:
Server verifies cookie

Revokes old refresh token

Issues new Access + Refresh token pair

Detects reuse of revoked tokens

Automatically invalidates all user sessions upon suspicious activity

## Session Management
Refresh tokens are:
Cryptographically hashed
Stored in MongoDB
Indexed for fast lookup

## Enforced:
Absolute session expiry (30 days)

Maximum 3 concurrent sessions per user

Silent Authentication Recovery

## Custom Axios interceptor:
Intercepts 401 Unauthorized

Automatically calls /auth/refresh

Replays original request

Prevents forced logout or UX disruption

# 🧩 Backend Engineering

Designed modular Express architecture with:

Route separation

Controller logic isolation

Custom middleware layers

Centralized error handling for:

TMDB rate limits (429)

Upstream API timeouts (504)

Auth failures

Implemented secure password hashing using bcrypt

Structured MongoDB models with proper indexing and validation

# 🎨 Frontend Engineering

Built responsive UI using React + Tailwind CSS

Implemented protected routes with conditional rendering

Managed authentication state securely in memory

Created dynamic media discovery views with paginated API consumption

# 🛠 Tech Stack
## Frontend
React
React Router
Tailwind CSS
Axios (custom interceptor wrapper)

## Backend
Node.js
Express.js
MongoDB
Mongoose
JSON Web Tokens (JWT)
bcrypt

## External Integration
TMDB API (The Movie Database)

# ⚙️ Setup Instructions
Clone Repository
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
Install Dependencies
## Backend
cd backend
npm install

## Frontend
cd ../frontend
npm install
Configure Environment Variables (Backend)

Create .env:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
TMDB_API_KEY=your_tmdb_api_key
Run Application

## Backend
npm run dev

## Frontend
npm run dev

# 📌 Engineering Takeaways

This project demonstrates:

Secure JWT architecture beyond basic tutorials

Enterprise-level refresh token rotation implementation

Defensive backend design against token replay attacks

Robust API integration with fault-tolerant error handling

Clean separation of concerns in full-stack development
