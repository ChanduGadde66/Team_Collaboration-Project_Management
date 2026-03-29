import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

function Sidebar() {
  const [createdProjects, setCreatedProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProjects = async () => {
    try {
      const [createdRes, assignedRes] = await Promise.all([
        API.get("/projects"),
        API.get("/projects/assigned")
      ]);
      setCreatedProjects(createdRes.data);
      setAssignedProjects(assignedRes.data);
    } catch (error) {
      console.error("Sidebar project load error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
      </svg>
    )},
    { path: "/projects", label: "Projects", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { path: "/create-project", label: "Create Project", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )},
    { path: "/my-tasks", label: "My Tasks", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )}
  ];

  return (
    <div className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">TeamCollab</h2>
            <p className="text-sm text-gray-500">Project Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={`mr-3 ${isActive(item.path) ? "text-indigo-600" : "text-gray-400"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Projects Section */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Your Projects
          </h3>

          {/* Owned Projects */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Owned
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {loading ? (
                <div className="flex items-center px-3 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 mr-2"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : createdProjects.length === 0 ? (
                <p className="text-sm text-gray-500 px-3 py-2">No owned projects</p>
              ) : (
                createdProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    to={`/project/${proj.id}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md truncate"
                  >
                    {proj.name}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Assigned Projects */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Assigned
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {loading ? (
                <div className="flex items-center px-3 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 mr-2"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : assignedProjects.length === 0 ? (
                <p className="text-sm text-gray-500 px-3 py-2">No assigned projects</p>
              ) : (
                assignedProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    to={`/project/${proj.id}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md truncate"
                  >
                    {proj.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;