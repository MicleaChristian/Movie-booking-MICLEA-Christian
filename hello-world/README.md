<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Movie Booking Application

A full-stack movie booking application built with NestJS and React.

## Features

- User authentication (register, login, JWT)
- Movie browsing and search using TMDB API
- Movie reservations
- Responsive UI with Tailwind CSS
- Comprehensive test coverage

## Tech Stack

### Backend
- NestJS
- PostgreSQL
- TypeORM
- JWT Authentication
- Jest for testing

### Frontend
- React
- Tailwind CSS
- Axios for API calls
- React Router for navigation

## Project Structure

```
hello-world/
├── src/
│   ├── auth/           # Authentication module
│   ├── movie/          # Movie module (TMDB integration)
│   ├── reservation/    # Reservation module
│   ├── user/           # User module
│   └── main.ts         # Application entry point
└── movie-booking-frontend/
    ├── src/
    │   ├── components/ # React components
    │   ├── pages/      # Page components
    │   └── App.js      # Main application component
    └── public/         # Static assets
```

## Test Coverage

Current test coverage:
- Overall Statement Coverage: 77.85%
- Branch Coverage: 61.29%
- Function Coverage: 82.05%
- Line Coverage: 78.27%

Key components with 100% coverage:
- User Service
- Movie Controller
- User Controller
- DTOs and Entities

## Getting Started

### Prerequisites

- Node.js (v20.17.0 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Movie-booking-MICLEA-Christian
```

2. Install backend dependencies:
```bash
cd hello-world
npm install
```

3. Install frontend dependencies:
```bash
cd movie-booking-frontend
npm install
```

### Database Setup

1. Install PostgreSQL if not already installed:
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt update && sudo apt install postgresql postgresql-contrib`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/)

2. Create the database:
```bash
psql -U postgres
CREATE DATABASE moviebook;
```

3. Update the database configuration in `hello-world/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=moviebook
```

### Running the Application

#### Option 1: Using the Start Script (Recommended)
The easiest way to start both servers is using the provided shell script:

```bash
cd hello-world
./start-servers.sh
```

This script will:
1. Kill any existing processes on ports 3000 and 3001
2. Start the backend server on port 3000
3. Wait for the backend to initialize
4. Start the frontend server on port 3001

#### Option 2: Manual Start
If you prefer to start the servers manually:

1. Start the backend server (port 3000):
```bash
cd hello-world
npm run start:dev
```

2. Start the frontend server (port 3001):
```bash
cd movie-booking-frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000

### Running Tests

To run the test suite with coverage:
```bash
cd hello-world
npm test -- --coverage
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register a new user
- POST `/auth/login` - User login
- GET `/auth/me` - Get current user info

### Movies
- GET `/movies/now-playing` - Get now playing movies
- GET `/movies/search` - Search movies

### Reservations
- POST `/reservations` - Create a reservation
- GET `/reservations` - Get user's reservations
- GET `/reservations/:id` - Get specific reservation
- DELETE `/reservations/:id` - Delete a reservation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Database Setup

This application uses PostgreSQL as its database. Follow the steps below to set up PostgreSQL:

1. Install PostgreSQL:
   - On macOS: `brew install postgresql`
   - On Ubuntu: `sudo apt update && sudo apt install postgresql postgresql-contrib`
   - On Windows: Download and install from [postgresql.org](https://www.postgresql.org/).

2. Start the PostgreSQL service:
   - macOS/Linux: `sudo service postgresql start`
   - Windows: Start the PostgreSQL service from the Services app.

3. Create a new database:
   ```bash
   psql -U postgres
   CREATE DATABASE your_database;
   ```

4. Update the `app.module.ts` file with your PostgreSQL credentials.

5. Run the application:
   ```bash
   npm run start
   ```

## Database Initialization

To initialize the database with the required schema:

1. Ensure `synchronize: true` is set in the `TypeOrmModule` configuration in `app.module.ts`.
2. Start the application:
   ```bash
   npm run start:dev
   ```
   This will automatically create the tables based on the defined entities.

### Optional: Using Migrations

If you prefer using migrations:

1. Generate a migration:
   ```bash
   npm run typeorm migration:generate -- -n InitialMigration
   ```

2. Run the migration:
   ```bash
   npm run typeorm migration:run
   ```

3. Disable `synchronize` in `app.module.ts` to avoid conflicts:
   ```typescript
   synchronize: false,
   ```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

### Core Technologies
- [NestJS Documentation](https://docs.nestjs.com) - Official NestJS framework documentation
- [React Documentation](https://react.dev) - Official React documentation
- [TypeScript Documentation](https://www.typescriptlang.org/docs) - Official TypeScript documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs) - Official PostgreSQL documentation

### Database & ORM
- [TypeORM Documentation](https://typeorm.io) - Official TypeORM documentation
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html) - PostgreSQL getting started guide
- [TypeORM with NestJS](https://docs.nestjs.com/techniques/database) - NestJS database integration guide

### Authentication & Security
- [JWT.io](https://jwt.io) - JSON Web Tokens documentation
- [Passport.js Documentation](http://www.passportjs.org/docs) - Passport.js authentication documentation
- [NestJS Authentication](https://docs.nestjs.com/security/authentication) - NestJS authentication guide

### Frontend Technologies
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Official Tailwind CSS documentation
- [React Router Documentation](https://reactrouter.com/en/main) - React Router documentation
- [Axios Documentation](https://axios-http.com/docs/intro) - Axios HTTP client documentation

### Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started) - Jest testing framework documentation
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing) - NestJS testing guide
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) - React testing documentation

### API Integration
- [TMDB API Documentation](https://developers.themoviedb.org/3) - The Movie Database API documentation
- [REST API Best Practices](https://docs.nestjs.com/controllers) - NestJS REST API guidelines

### Development Tools
- [Node.js Documentation](https://nodejs.org/en/docs) - Node.js documentation
- [npm Documentation](https://docs.npmjs.com) - npm package manager documentation
- [ESLint Documentation](https://eslint.org/docs/latest) - ESLint documentation

### Deployment & DevOps
- [NestJS Deployment](https://docs.nestjs.com/deployment) - NestJS deployment guide
- [Docker Documentation](https://docs.docker.com) - Docker documentation
- [Git Documentation](https://git-scm.com/doc) - Git version control documentation

### Community & Support
- [NestJS Discord](https://discord.gg/G7Qnnhy) - NestJS community Discord
- [React Community](https://react.dev/community) - React community resources
- [Stack Overflow - NestJS](https://stackoverflow.com/questions/tagged/nestjs) - NestJS questions
- [Stack Overflow - React](https://stackoverflow.com/questions/tagged/react) - React questions
- [Stack Overflow - TypeORM](https://stackoverflow.com/questions/tagged/typeorm) - TypeORM questions

### Learning Resources
- [NestJS Courses](https://courses.nestjs.com) - Official NestJS courses
- [React Learning](https://react.dev/learn) - React learning resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - TypeScript learning guide

### Best Practices
- [NestJS Best Practices](https://docs.nestjs.com/faq/common-errors) - NestJS best practices
- [React Best Practices](https://react.dev/learn/thinking-in-react) - React best practices
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) - TypeScript best practices

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
