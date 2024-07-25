# Robotic Platform State Management System

This project is a state management system for a robotic platform, built using Node.js, Express.js, TypeScript, and MongoDB. The system includes features such as state creation, updating, deletion, user authentication and authorization, and state aggregation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)
- [Validation](#validation)
- [Aggregation Methods](#aggregation-methods)
- [Unit Tests](#unit-tests)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up and run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/robotic-platform-state-management.git
    cd robot_operations
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    DB_URL=mongodb://localhost:27017/your_database_name
    SESSION_SECRET=your_session_secret
    PORT=3000
    ```

4. Start the application:
    ```bash
    npm run dev
    ```

## Usage

The API provides endpoints for managing states and users. You can use tools like Postman or Swagger to interact with the API.

## Folder Structure

src/
│
├── config/
│ └── passport.ts
│
├── controllers/
│ ├── stateControllers.ts
│ └── userControllers.ts
│
├── database/
│ └── db.ts
│
├── middleware/
│ └── admin.ts
│
├── models/
│ ├── State.ts
│ └── User.ts
│
├── routes/
│ ├── stateRoutes.ts
│ └── userRoutes.ts
│
├── types/
│ └── express/index.d.ts
│
└── index.ts


## API Endpoints

### User Endpoints

- **Register a user**: `POST /user/register`
- **Login**: `POST /user/login`
- **Logout**: `POST /user/logout`
- **Modify access level**: `PUT /user/modify-access` (Admin only)
- **Delete user**: `DELETE /user/delete-user` (Admin only)
- **View all users**: `GET /user/view-all-users` (Admin only)

### State Endpoints

- **Create a state**: `POST /state/createState` (Authenticated users - admin, SuperAdmin)
- **Get a state by name**: `GET /state/getState/:name` 
- **Update a state**: `PUT /state/updateState/:name` (Authenticated users -admin, SuperAdmin)
- **Delete a state**: `DELETE /state/deleteState/:name` (Authenticated users -admin, SuperAdmin)
- **Get all states**: `GET /state/getAll`
- **Get state summary**: `GET /state/summary`

## Authentication and Authorization

- **User roles**: User, Admin, SuperAdmin
- **Session-based authentication**: Implemented using Passport.js
- **Authorization middleware**:
  - `isUser`: Check if the user is logged in
  - `isAdmin`: Check if the user has Admin or SuperAdmin access
  - `isSuperAdmin`: Check if the user has SuperAdmin access

## Validation

Basic validation is implemented for input data using Mongoose schemas.

## Aggregation Methods

The system includes methods to aggregate state counts and statuses by hours, days, and months. These methods are optimized for performance to handle a large number of states efficiently.

## Unit Tests

Unit tests for the API endpoints can be found in the `tests` directory. To run the tests, use the following command:
```bash
npm test

