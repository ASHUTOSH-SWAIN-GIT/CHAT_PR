import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "../src/pages/Login"
import MainPage from "./pages/Dashboard";
import ChatPage from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="" element={<Home/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dash" element={<MainPage />} />
      <Route path="/chat" element={<ChatPage />} />


    </Routes>
  );
}

export default App;
