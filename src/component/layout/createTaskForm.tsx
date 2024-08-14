import React, { useState, useEffect } from "react";
import { useTaskContext } from "../../context/useTask";
import { useUserContext } from "../../context/useUser";

const CreateTaskForm: React.FC = () => {
  const { createTask } = useTaskContext();
  const { users, getUsers } = useUserContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<number | "">(0); // Default to 0 or empty

  useEffect(() => {
    getUsers(); // Fetch users when component mounts
  }, [getUsers]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : "";
    const finalAssigneeId = assigneeId === "" ? 0 : assigneeId;

    await createTask({
      title,
      description,
      due_date: formattedDueDate,
      is_complete: false,
      assignee_id: finalAssigneeId,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setAssigneeId(0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="assignee"
            className="block text-sm font-medium text-gray-700"
          >
            Assignee (optional)
          </label>
          <select
            id="assignee"
            value={assigneeId !== 0 ? assigneeId : ""}
            onChange={(e) =>
              setAssigneeId(e.target.value ? Number(e.target.value) : 0)
            }
            className="mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTaskForm;
