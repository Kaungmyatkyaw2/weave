# Weave Project README 🌐🧵

## Project Overview

Weave is a social media application built on the MERN stack, comprising MongoDB, Express.js, React, and Node.js. Below is an overview of the technologies and libraries used in both frontend and backend development.

### Frontend

- **React with Vite:** Weave's frontend is developed using React with Vite as the build tool. Vite provides fast and efficient development and builds processes.

- **React Query:** For server state management, React Query is employed. It simplifies the management of remote data fetching, caching, and state synchronization.

- **Redux Toolkit:** Global state management and persistence are handled by Redux Toolkit. It ensures a predictable state container and aids in managing complex state logic.

- **Tailwind CSS:** Styling is done using Tailwind CSS, a utility-first CSS framework that helps in building modern and responsive user interfaces.

- **Shadcn:** The component library used in the project is Shadcn. It provides a set of reusable and well-designed components for building the user interface.

- **Axios:** Data fetching from the server is facilitated by Axios, a promise-based HTTP client that works seamlessly with React applications.

- **TypeScript:** The project is developed using TypeScript, adding static typing to enhance code quality and developer experience.

- **React Hook Form:** For form validation, React Hook Form is utilized. It provides a simple and efficient way to manage and validate forms in React applications.

### Backend

- **Node.js and Express.js:** The backend is developed using Node.js, a server-side JavaScript runtime, and Express.js, a web application framework for Node.js. Together, they provide a robust and scalable server environment.

- **MongoDB with Mongoose:** MongoDB is used as the database, and Mongoose is the MongoDB object modeling tool designed to work in an asynchronous environment. It simplifies interactions with the MongoDB database.

- **Custom Credential Authentication:** Weave includes a custom authentication system based on JSON Web Tokens (JWT). This allows for secure and efficient user authentication.

## Project Features 🚀

Weave comes with the following features:

- **User Login/Logout:** Allow users to securely log in and out of the platform.

- **Email Verification:** Verify user email addresses for added security.

- **Reset Password/Forgot Password:** Provide users with the ability to reset their passwords in case they forget them.

- **CRUD Post:** Allow users to create, read, update, and delete posts.

- **CRUD Comment:** Enable users to create, read, update, and delete comments on posts.

- **Share Post:** Users can share posts on the platform.

- **Reply to Comment:** Allow users to reply to comments on posts.

## Project Structure 🏗️

### Frontend

#### `/client`

- `/src`: Contains the source code for the Weave frontend application.

  - `/assets`: Includes images and other static resources.

  - `/components`: Holds components specific to each page.

  - `/hooks`: Houses custom React hooks for reusability.

  - `/lib`: Contains reusable functions and utilities.

  - `/pages`: Defines individual pages or views of the Weave application.

  - `/shared`: Contains components shared across multiple pages.

  - `/store`: Manages global state using Redux Toolkit (RTK).

  - `/types`: Stores TypeScript type definitions.

  - `/validation`: Includes form validation functions using React Hook Form.

  - `App.tsx`: The main entry point for the Weave React application.

  - `main.tsx`: Primary configuration and initialization file.

  - `index.css`: Global CSS styles for the Weave application.

### Backend

#### `/server`

- `/controllers`: Contains middleware for each route.

- `/dev-data`: Holds Pug templates for development data.

- `/models`: Includes Mongoose models for database interactions.

- `/routes`: Defines API routes.

- `/utils`: Houses reusable classes and functions.

- `app.js`: Creates the server and sets up middleware in this file.

- `server.js`: Runs the server from `app.js` and connects to the MongoDB database.
