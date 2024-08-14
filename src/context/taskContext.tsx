// src/context/TaskContext.tsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  is_complete: boolean;
  assignee_id: number;
}

export interface TaskContextProps {
  tasks: Task[];
  createTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  getTasks: () => void;
  getTaskById: (id: number) => Promise<Task | null>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async () => {
    try {
      const response = await axiosInstance.get("/task");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const createTask = async (task: Omit<Task, "id">) => {
    try {
      await axiosInstance.post("/task", task);
      getTasks(); // Refresh tasks list after creating
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      await axiosInstance.put(`/task/${id}`, updates);
      getTasks(); 
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axiosInstance.delete(`/task/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const getTaskById = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/task/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch task", error);
      return null;
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        deleteTask,
        getTasks,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext };
