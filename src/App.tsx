import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import TasksPage from "./pages/taskPage";
import "./index.css";
import { UserProvider } from "./context/userContext";
import { TaskProvider } from "./context/taskContext";
import PrivateRoute from "./component/layout/PrivateRoute";

function App() {
  return (
    <Router>
      <UserProvider>
        <TaskProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<TasksPage />} />
            </Route>
          </Routes>
        </TaskProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
