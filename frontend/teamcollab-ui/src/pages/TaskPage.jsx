import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../layouts/Sidebar";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";

function TaskPage() {
  const { projectId, memberId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member || { name: "Team Member" };
  const project = location.state?.project || { name: "Project" };

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await API.get(`/tasks/project/${projectId}`);
      const memberTasks = response.data.filter((task) => String(task.assignedTo?.id) === String(memberId));
      setTasks(memberTasks);
    } catch (err) {
      setError("Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, memberId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreatingTask(true);

    try {
      await API.post("/tasks", { title, description, status: "TODO" }, { params: { projectId, userId: memberId } });
      setTitle("");
      setDescription("");
      toast.success("Task created successfully");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}/status`, null, { params: { status } });
      toast.success("Status updated");
      fetchTasks();
    } catch (err) {
      toast.error("Status update failed (only assigned user can update)");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO": return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "TODO").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    completed: tasks.filter(t => t.status === "COMPLETED").length
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(`/project/${projectId}`)}
                className="text-indigo-600 hover:text-indigo-800 flex items-center mb-2"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Project
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Tasks for {member.name}</h1>
              <p className="text-gray-600">Project: {project.name}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{taskStats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{taskStats.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{taskStats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{taskStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Create Task Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  placeholder="Describe the task requirements and objectives"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={creatingTask}
              >
                {creatingTask ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Task...
                  </div>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Assigned Tasks</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
              <p className="text-gray-600">Create the first task for this team member above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                    <select
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={task.status}
                      onChange={(e) => handleStatus(task.id, e.target.value)}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
