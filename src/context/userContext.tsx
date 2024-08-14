import React, { createContext, useState, ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface UserContextProps {
  users: User[];
  register: (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<string | null>;
  getUsers: () => void;
  getUserById: (id: number) => Promise<User | null>;
  updateUser: (id: number, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate(); // Initialize navigate

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      await axiosInstance.post("/register", userData);
      await getUsers(); // Refresh users list after successful registration
    } catch (error) {
      console.error("Failed to register", error);
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await axiosInstance.post("/login", credentials);
      const { token } = response.data;
      localStorage.setItem("token", token); // Save JWT token
      return token;
    } catch (error) {
      console.error("Failed to login", error);
      return null;
    }
  };

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const getUserById = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user", error);
      return null;
    }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      await axiosInstance.put(`/users/${id}`, updates);
      await getUsers(); // Refresh users list after update
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login page
  };

  return (
    <UserContext.Provider
      value={{
        users,
        register,
        login,
        getUsers,
        getUserById,
        updateUser,
        deleteUser,
        logout, // Provide the logout function
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
