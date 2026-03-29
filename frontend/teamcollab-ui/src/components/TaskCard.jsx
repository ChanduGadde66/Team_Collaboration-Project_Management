function TaskCard({ task }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'TODO': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h4>
          <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          {task.project && (
            <div className="text-sm text-gray-500">
              Project: {task.project.name}
            </div>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace("_", " ")}
        </span>
      </div>

      {task.assignedTo && (
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Assigned to {task.assignedTo.name}
        </div>
      )}
    </div>
  );
}

export default TaskCard;