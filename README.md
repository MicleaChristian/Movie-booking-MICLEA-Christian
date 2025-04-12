# Movie Booking Application

A NestJS application for booking movie tickets with user authentication and movie reservations.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Movie Browsing**: Browse and search movies from TMDB API
- **Movie Reservation System**: Reserve movie slots with time conflict detection
- **Swagger Documentation**: API endpoints documented with Swagger

## Reservation System

The reservation system allows users to:
- Book movies with a standard duration of 2 hours
- View their existing reservations
- Cancel reservations that haven't started yet
- Automatically prevents booking conflicts (overlapping movie times)

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get the currently authenticated user

### Movies
- `GET /movies/now-playing` - Get currently playing movies
- `GET /movies/search?query=...` - Search for movies

### Reservations
- `POST /reservations` - Create a new reservation
- `GET /reservations` - Get all user's reservations
- `GET /reservations/:id` - Get a specific reservation
- `DELETE /reservations/:id` - Cancel a reservation

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Keys
TMDB_API_KEY=your_tmdb_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Database Configuration - Local Development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=moviebook
DB_SSL=false

# Environment
NODE_ENV=development
PORT=3000

# CORS Configuration
FRONTEND_URL=http://localhost:3001
```

## Running Locally

1. Install dependencies: `npm install`
2. Set up environment variables (create a `.env` file)
3. Run the application: `npm run start:dev`
4. Access Swagger documentation at: http://localhost:3000/api

## Deployment

### Database Deployment on Render.com

1. Create a PostgreSQL database on Render.com
2. Note the connection details (host, port, username, password, database name)
3. Set SSL to true for Render.com PostgreSQL

### Backend Deployment on Render.com

1. Create a new Web Service on Render.com
2. Connect to your GitHub repository
3. Configure the build command: `npm install`
4. Configure the start command: `npm run start:prod`
5. Add all environment variables from your `.env` file:
   - Update database connection details to point to your Render PostgreSQL
   - Set NODE_ENV to "production"
   - Set DB_SSL to "true"
   - Update FRONTEND_URL to your frontend deployment URL
6. Deploy the service

### Accessing the Deployed API

- Backend API: [Your Render Web Service URL]
- Swagger Documentation: [Your Render Web Service URL]/api

## Testing

- Run unit tests: `npm run test`
- Run e2e tests: `npm run test:e2e`
 
