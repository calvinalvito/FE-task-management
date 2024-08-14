import React, { useEffect, useState } from "react";
import { useTaskContext } from "../../context/useTask";
import { useUserContext } from "../../context/useUser";
import { Task } from "../../context/taskContext";

const TaskList: React.FC = () => {
  const { tasks, getTasks, deleteTask, updateTask } = useTaskContext();
  const { users } = useUserContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<number | undefined>(
    undefined
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssignee, setEditAssignee] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const userMap = users.reduce((map, user) => {
    map[user.id] = user.username;
    return map;
  }, {} as { [key: number]: string });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssignee =
      selectedAssignee === undefined || task.assignee_id === selectedAssignee;
    return matchesSearch && matchesAssignee;
  });

  const completedTasks = filteredTasks.filter((task) => task.is_complete);
  const pendingTasks = filteredTasks.filter((task) => !task.is_complete);

  const handleTaskStatusChange = async (id: number, isComplete: boolean) => {
    await updateTask(id, { is_complete: isComplete });
    getTasks();
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.due_date);
    setEditAssignee(task.assignee_id);
  };

  const handleUpdate = async () => {
    if (editingTask) {
      await updateTask(editingTask.id, {
        title: editTitle,
        description: editDescription,
        due_date: editDueDate,
        assignee_id: editAssignee ?? undefined, // Convert to undefined if null
      });
      setEditingTask(null);
      setEditTitle("");
      setEditDescription("");
      setEditDueDate("");
      setEditAssignee(undefined);
      getTasks();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Task List</h2>

      {/* Search and Filter Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description"
            className="mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="assignee"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Assignee
          </label>
          <select
            id="assignee"
            value={selectedAssignee ?? ""}
            onChange={(e) =>
              setSelectedAssignee(Number(e.target.value) || undefined)
            }
            className="mt-1 block w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => getTasks()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Apply Filters
        </button>
      </div>

      {/* Editing Task Form */}
      {editingTask && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Edit Task</h3>
          <div>
            <label
              htmlFor="editTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="editTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="editDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="editDescription"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="editDueDate"
              className="block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <input
              type="date"
              id="editDueDate"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="editAssignee"
              className="block text-sm font-medium text-gray-700"
            >
              Assignee
            </label>
            <select
              id="editAssignee"
              value={editAssignee ?? ""}
              onChange={(e) =>
                setEditAssignee(Number(e.target.value) || undefined)
              }
              className="mt-1 block w-full p-2 border rounded-lg"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleUpdate}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Update Task
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
        <ul>
          {pendingTasks.map((task) => (
            <li key={task.id} className="border-b py-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Assignee: {userMap[task.assignee_id] || "Unassigned"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTaskStatusChange(task.id, true)}
                    className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                  >
                    Mark as Complete
                  </button>
                  <button
                    onClick={() => startEditing(task)}
                    className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
        <ul>
          {completedTasks.map((task) => (
            <li key={task.id} className="border-b py-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Assignee: {userMap[task.assignee_id] || "Unassigned"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTaskStatusChange(task.id, false)}
                    className="bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-700"
                  >
                    Mark as Pending
                  </button>
                  <button
                    onClick={() => startEditing(task)}
                    className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
