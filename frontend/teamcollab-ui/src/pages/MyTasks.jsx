import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../layouts/Sidebar";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadTasks = async () => {
    try {
      const response = await API.get("/tasks/user");
      setTasks(response.data);
    } catch (err) {
      setError("Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}/status`, null, { params: { status } });
      toast.success("Task status updated");
      loadTasks();
    } catch (err) {
      toast.error("Unable to update task status");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const taskStats = {
    all: tasks.length,
    TODO: tasks.filter(t => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS").length,
    COMPLETED: tasks.filter(t => t.status === "COMPLETED").length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO": return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load tasks</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadTasks}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try again
            </button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">
            Track and manage all tasks assigned to you across your projects.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "all"
                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                : "bg-white border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">{taskStats.all}</div>
            <div className="text-sm text-gray-600">All Tasks</div>
          </button>
          <button
            onClick={() => setFilter("TODO")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "TODO"
                ? "bg-gray-50 border-gray-200 shadow-sm"
                : "bg-white border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">{taskStats.TODO}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </button>
          <button
            onClick={() => setFilter("IN_PROGRESS")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "IN_PROGRESS"
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "bg-white border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">{taskStats.IN_PROGRESS}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </button>
          <button
            onClick={() => setFilter("COMPLETED")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "COMPLETED"
                ? "bg-green-50 border-green-200 shadow-sm"
                : "bg-white border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">{taskStats.COMPLETED}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </button>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "all" ? "No tasks assigned" : `No ${filter.toLowerCase().replace("_", " ")} tasks`}
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "Tasks assigned to you will appear here."
                : `You don't have any ${filter.toLowerCase().replace("_", " ")} tasks at the moment.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      {task.project && (
                        <div className="text-xs text-gray-500 mb-3">
                          Project: {task.project.name}
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatus(task.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;
