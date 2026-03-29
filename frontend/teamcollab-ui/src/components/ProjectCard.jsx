import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {
  const navigate = useNavigate();

  // Calculate project stats (mock data for now)
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(task => task.status === 'COMPLETED').length || 0;
  const inProgressTasks = project.tasks?.filter(task => task.status === 'IN_PROGRESS').length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'TODO': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description || "No description provided"}
            </p>
          </div>
          <div className="ml-4">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Progress Bar */}
          {totalTasks > 0 && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Task Counts */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-gray-600">{totalTasks} tasks</span>
              </div>
              {completedTasks > 0 && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-gray-600">{completedTasks} done</span>
                </div>
              )}
              {inProgressTasks > 0 && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-gray-600">{inProgressTasks} in progress</span>
                </div>
              )}
            </div>
          </div>

          {/* Members */}
          {project.members && project.members.length > 0 && (
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                {project.members.slice(0, 3).map((member, index) => (
                  <div
                    key={member.id || index}
                    className="w-6 h-6 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center"
                    title={member.name}
                  >
                    <span className="text-xs font-medium text-white">
                      {member.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ))}
                {project.members.length > 3 && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      +{project.members.length - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {project.members.length} member{project.members.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;