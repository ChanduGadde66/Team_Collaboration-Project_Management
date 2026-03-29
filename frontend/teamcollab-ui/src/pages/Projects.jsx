import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../layouts/Sidebar";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-toastify";

function Projects() {
  const [ownedProjects, setOwnedProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("owned");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const [ownedRes, assignedRes] = await Promise.all([
        API.get("/projects"),
        API.get("/projects/assigned")
      ]);
      setOwnedProjects(ownedRes.data);
      setAssignedProjects(assignedRes.data);
    } catch (error) {
      setError("Failed to load projects");
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading your projects...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load projects</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentProjects = activeTab === "owned" ? ownedProjects : assignedProjects;
  const totalProjects = ownedProjects.length + assignedProjects.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">
              {totalProjects === 0
                ? "No projects yet. Create your first project to get started."
                : `You have ${totalProjects} project${totalProjects !== 1 ? 's' : ''} in total.`
              }
            </p>
          </div>
          <Link
            to="/create-project"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("owned")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "owned"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Owned Projects ({ownedProjects.length})
              </button>
              <button
                onClick={() => setActiveTab("assigned")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "assigned"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Assigned Projects ({assignedProjects.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Projects Grid */}
        {currentProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === "owned" ? "No owned projects" : "No assigned projects"}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "owned"
                ? "Create your first project to start collaborating with your team."
                : "Projects assigned to you by other team members will appear here."
              }
            </p>
            {activeTab === "owned" && (
              <Link
                to="/create-project"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create your first project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;