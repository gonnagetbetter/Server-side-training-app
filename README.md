# Server-side Training App

A comprehensive training management application built with NestJS for fitness clubs and training centers.

## Features

- **User Management**: Registration, authentication, and user profiles
- **Exercise Management**: Create, update, and manage exercises
- **Training Management**: Schedule and track training sessions
- **Group Management**: Organize users into training groups
- **Membership Management**: Handle user memberships and subscriptions
- **Payment Integration**: Process payments via Monobank
- **Statistics**: Track and visualize training progress
- **Real-time Notifications**: WebSocket-based notification system

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with MikroORM
- **Caching**: Redis
- **Authentication**: JWT
- **API Documentation**: Swagger
- **Real-time Communication**: Socket.io
- **Payment Processing**: Monobank API

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- Monobank API token (for payment integration)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/server-side-training-app.git
   cd server-side-training-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Database configuration
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_HOST=your_db_host
   DB_PORT=your_db_port

   # Redis configuration
   REDIS_URL=redis://your_redis_host:your_redis_port

   # JWT configuration
   JWT_SECRET=your_jwt_secret

   # Monobank
   MONOBANK_API_URL=https://api.monobank.ua
   REDIRECT_URL=your_monobank_redirect_URL
   MONOBANK_TOKEN=your_monobank_token
   BASE_API_URL=your_api_url
   ```

4. Run database migrations:
   ```bash
   npm run migration:up
   ```

## Running the Application

### Development Mode

```bash
# Watch mode
npm run start:dev
```

### Production Mode

```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Database Management

### Creating Migrations

```bash
npm run migration:create
```

### Running Migrations

```bash
npm run migration:up
```

### Reverting Migrations

```bash
npm run migration:down
```

## Docker

The application can be run using Docker:

```bash
# Build and start the containers
docker-compose up -d
```

## Project Structure

```
src/
├── auth/             # Authentication module
├── cache/            # Caching functionality
├── common/           # Shared utilities and components
├── database/         # Database configuration and migrations
├── exercise/         # Exercise management
├── exercise-set/     # Exercise set management
├── groups/           # Group management
├── membership/       # Membership management
├── monobank/         # Monobank integration for payments
├── notifications/    # Notification system
├── stats/            # Statistics tracking
├── trainings/        # Training management
├── users/            # User management
├── app.module.ts     # Main application module
├── config.ts         # Application configuration
├── main.ts           # Application entry point
└── mikro-orm.config.ts # MikroORM configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
