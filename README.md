# Real Time Collaborative Task Manager

The Real-Time Collaborative Task Manager simplifies teamwork by managing tasks efficiently. It uses Mantine Datatable for a better user interface with features like filtering and sorting tasks easily. It also updates tasks in real time using WebSocket and makes sure everyone sees the same information at all times.

## Platforms

I chose MongoDB as the database and deployed it on MongoDB Cloud for secure and scalable storage. The backend developed with Express and hosted on [Render](https://task-manager-be-ecsh.onrender.com). The frontend is deployed on Vercel, ensuring fast loading and easy access.

## Backend Access

To access the backend repository for the Real-Time Collaborative Task Manager, please visit the following link: [task-manager-be](https://github.com/haticedalkiran/task-manager-be)

## Scripts

`npm run dev`, starts development server.

`npm run built`, bundles the code for production.

`npm run lint`, runs eslint.

## Structure and Components

### Table.ts

Table component uses Mantine Datatable for a modern, user-friendly experience. It supports dynamic filtering and sorting based on various criteria such as title and status. Users can create, edit and delete tasks and these actions are secured by user authentication. It guarantees that only authenticated users have the permission to perform these operations. Authentication only verifies user existence in the database without in-depth security checks. It aims to simulate user experience rather than enforce authentication measures. Debounced search functionality optimizes performance by reducing excessive filtering on user input. Task data is dynamically updated via WebSocket, reflecting real-time changes across the client-side application.

When creating a task, data of title, detail, assignee and due date must be specified. The reporter is automatically assigned based on the username of the active user. Initially, the task status is set to "open" upon creation.
Modifications to a task, including updates to the title, detail, assignee, due date and status can be executed through the actions > update section. This provides a flexible interface for users to manage and adjust task details as necessary.

Deletion of a task is facilitated through the actions > delete section. Upon confirmation within the prompted modal, the task will be permanently removed from the database.

### State Management

Auth: This project implements a login/signup system enabling users to assign tasks to each other and edit tasks assigned to them. The Auth state handles login and logout processes, and retrieves user information within the system. isLoggedIn and user information are stored in the local state. The isLoggedIn state is subsequently checked to prevent the need for users to log in again.

Modal: Given that the task creation and task update processes fundamentally utilize similar components, I designed a single form that can be adapted for both scenarios through state management. The "action" state determines whether a task is being created or updated. If the action is set to update, the task to be updated is assigned to the modal.

Task: In this segment, the CRUD methods for tasks are updated based on data received from the socket. Real-time update mechanism helps to maintain up-to-date task information.

### Socket.ts

This file contains the socket requests to be sent to the backend. After dispatching a request, listeners such as socket.on("task-deleted") are in place to listen for results. These listeners update the Redux state based on the outcomes received and ensure the front-end state remains synchronized with the backend in real-time.
