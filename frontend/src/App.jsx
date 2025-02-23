import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainPage from "./pages/Dashboard";
import ChatPage from "./pages/Chat";
import "../src/index.css"; // or any other CSS file


function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dash" element={<MainPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
