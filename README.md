# MERN Chat Application

## Overview
This is a real-time chat application built using the **MERN stack (MongoDB, Express.js, React, Node.js)** with **Socket.io** for instant messaging. The app allows users to communicate in real time with features like authentication, message persistence, and a modern UI built with **Tailwind CSS**.

## Features
- **User Authentication** (Signup/Login)
- **Real-time messaging** using **Socket.io**
- **MongoDB database** for storing messages and user details
- **Express.js backend** with RESTful APIs
- **React frontend** with a responsive UI (Tailwind CSS)
- **Secure authentication** using JWT tokens
- **Chat history persistence** in MongoDB
- **Typing indicators** (Optional enhancement)
- **Online/offline status updates** (Optional enhancement)

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time communication:** Socket.io
- **Authentication:** JSON Web Tokens (JWT)

## Hosted Website
[Chat App](https://chat-pr-mauve.vercel.app/)

## Installation & Setup

### Prerequisites
Make sure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **MongoDB** (Local or cloud-based, e.g., MongoDB Atlas)

### Clone the Repository
```sh
git clone https://github.com/your-username/mern-chat-app.git
cd mern-chat-app
```

### Backend Setup
```sh
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file inside the `backend` directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

#### Start the Backend Server
```sh
npm run dev
```

### Frontend Setup
```sh
cd frontend
npm install
```

#### Start the Frontend Server
```sh
npm start
```

### Run the Application
The application should now be running at:
- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:5000`

## API Endpoints (Backend)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/users` | Fetch all users |
| `POST` | `/api/messages` | Send a message |
| `GET` | `/api/messages/:chatId` | Get messages of a chat |

## Folder Structure
```
mern-chat-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   ├── server.js
│   ├── .env
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
│
├── README.md
├── .gitignore
```

## Future Enhancements
- Group Chats
- Message Reactions
- Voice Notes
- Profile Pictures & Custom Usernames

## License
This project is licensed under the **MIT License**.

## Author
**Your Name**  
LinkedIn: [Your Profile](https://www.linkedin.com/in/your-profile)  
GitHub: [Your GitHub](https://github.com/your-username)

