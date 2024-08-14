import React from "react";
import CreateTaskForm from "../component/layout/createTaskForm";
import TaskList from "../component/layout/taskList";
import Header from "../component/layout/header";

const TasksPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <Header />
      <CreateTaskForm />
      <TaskList />
    </div>
  );
};

export default TasksPage;
