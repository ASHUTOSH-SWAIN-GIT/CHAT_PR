import { useState } from "react";
import axios from "axios";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://localhost:9000/api/users/search?username=${query}`);
      setUsers(response.data.users);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search for a user..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded-lg"
      />
      <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="mt-4">
        {users.map((user) => (
          <li key={user._id} className="p-2 border-b">
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUsers;
