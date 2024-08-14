// src/components/Header.tsx
import React from "react";
import { useUserContext } from "../../context/useUser";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { users, logout } = useUserContext();
  const navigate = useNavigate();

  const currentUserId = Number(localStorage.getItem("userId"));
  const currentUser = users.find((user) => user.id === currentUserId);

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-semibold">
        {currentUser ? `Welcome, ${currentUser.username}` : "Welcome"}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
