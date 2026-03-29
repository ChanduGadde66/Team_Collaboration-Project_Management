import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import TaskPage from "./pages/TaskPage";
import MyTasks from "./pages/MyTasks";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/task/:projectId/:memberId" element={<ProtectedRoute><TaskPage /></ProtectedRoute>} />
        <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;