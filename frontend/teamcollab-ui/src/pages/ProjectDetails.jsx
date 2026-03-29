import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../layouts/Sidebar";
import { toast } from "react-toastify";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProject = async () => {
    try {
      const response = await API.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      setError("Failed to load project details");
      toast.error("Failed to load project details");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await API.get(`/tasks/project/${id}`);
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProject();
      await fetchTasks();
      setLoading(false);
    };

    load();
  }, [id]);

  const handleTaskStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}/status`, null, { params: { status } });
      toast.success("Task status updated");
      fetchTasks();
    } catch (err) {
      toast.error("You can only update your assigned tasks");
    }
  };

  const handleAddTask = (member) => {
    navigate(`/task/${id}/${member.id}`, {
      state: {
        member,
        project: { id: project.id, name: project.name }
      }
    });
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
            <p className="text-gray-600">Loading project details...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load project</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/projects")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Projects
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
          <button
            onClick={() => navigate("/projects")}
            className="text-indigo-600 hover:text-indigo-800 flex items-center mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project?.name}</h1>
          <p className="text-gray-600 text-lg">{project?.description}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{project?.members?.length || 0}</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{taskStats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Members</h2>
            {project?.members?.length ? (
              <div className="space-y-4">
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-medium text-sm">
                          {member.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddTask(member)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Manage Tasks
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
                <p className="text-gray-600">Add members to this project to start assigning tasks.</p>
              </div>
            )}
          </div>

          {/* Tasks Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tasks Overview</h2>
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600">Tasks will appear here once team members are assigned work.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        {task.assignedTo && (
                          <div className="text-xs text-gray-500">
                            Assigned to: {task.assignedTo.name}
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Created {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskStatus(task.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
    </div>
  );
}

export default ProjectDetails;
