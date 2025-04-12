#!/bin/bash

# Kill any processes running on ports 3000 and 3001
echo "Killing any processes running on ports 3000 and 3001..."
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true

# Start the backend server
echo "Starting the backend server on port 3000..."
cd /Users/christian.miclea/Desktop/Movie-booking-MICLEA-Christian/hello-world
npm run start:dev &

# Wait for the backend server to start
echo "Waiting for the backend server to start..."
sleep 5

# Start the frontend server
echo "Starting the frontend server on port 3001..."
cd /Users/christian.miclea/Desktop/Movie-booking-MICLEA-Christian/hello-world/movie-booking-frontend
npm start &

echo "Both servers are starting. Check http://localhost:3001 for the frontend and http://localhost:3000 for the backend." 