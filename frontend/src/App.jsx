import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainPage from "./pages/Dashboard";
import ChatPage from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import "../src/index.css"; // or any other CSS file
import Profile from "./pages/Profile";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dash" element={<MainPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<Profile />} />

        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
