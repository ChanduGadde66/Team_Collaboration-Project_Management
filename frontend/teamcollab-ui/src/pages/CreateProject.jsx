import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../layouts/Sidebar";
import { toast } from "react-toastify";

function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([{ email: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const addMember = () => {
    setMembers([...members, { email: "" }]);
  };

  const updateMember = (index, field, value) => {
    const updatedMembers = members.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setMembers(updatedMembers);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First create the project
      const projectResponse = await API.post("/projects", {
        name,
        description
      });

      const projectId = projectResponse.data.id;

      // Then add members
      for (const member of members) {
        if (member.email.trim()) {
          await API.post("/projects/add-member", {
            projectId,
            email: member.email.trim()
          });
        }
      }

      toast.success("Project created successfully!");
      navigate("/projects");
    } catch (error) {
      setError("Failed to create project. Please try again.");
      toast.error("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
          <p className="text-gray-600">Set up a new project and invite your team members to collaborate.</p>
        </div>

        <div className="max-w-2xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateProject} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Project Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter a descriptive project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    placeholder="Describe the project's goals, scope, and objectives"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    rows="4"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                <button
                  type="button"
                  onClick={addMember}
                  className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Member
                </button>
              </div>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address {index === 0 && "(Optional)"}
                      </label>
                      <input
                        type="email"
                        placeholder="team.member@company.com"
                        value={member.email}
                        onChange={(e) => updateMember(index, "email", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Team members will receive an invitation to join this project. You can add more members later from the project details page.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="mr-4 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !name.trim() || !description.trim()}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Project...
                  </div>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;