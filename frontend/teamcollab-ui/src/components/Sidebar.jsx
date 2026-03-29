// This is a component version of Sidebar, if needed for specific use
// Currently using layouts/Sidebar.jsx for the main layout

import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">TeamCollab</h2>
      <ul className="space-y-3">
        <li><Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link></li>
        <li><Link to="/projects" className="block py-2 px-4 hover:bg-gray-700 rounded">Projects</Link></li>
        <li><Link to="/create-project" className="block py-2 px-4 hover:bg-gray-700 rounded">Create Project</Link></li>
        <li>
          <button
            className="w-full bg-red-500 px-4 py-2 mt-4 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;