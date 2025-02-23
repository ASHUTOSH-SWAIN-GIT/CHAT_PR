import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  if (!user)
    return <h2 className="text-center mt-10 text-lg text-gray-600">Loading Profile...</h2>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h2 className="text-2xl font-bold mt-4">{user?.name || "User"}</h2>
          <p className="text-gray-500">@{user?.username || "unknown"}</p>
        </div>

        {/* User Details */}
        <div className="mt-6 space-y-3">
          <p className="text-gray-700"><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p className="text-gray-700"><strong>Username:</strong> {user?.username || "N/A"}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/dash")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
