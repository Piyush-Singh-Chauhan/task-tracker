import React from 'react';
import { FiTrash2, FiEdit2, FiCalendar, FiFlag } from 'react-icons/fi';
import { format } from 'date-fns';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-white rounded-lg shadow p-4 mb-3 border-l-4 ${
      task.status === 'completed' ? 'border-green-500 bg-green-50' : 
      isOverdue ? 'border-red-500' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onToggleStatus(task)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <h3 className={`font-medium ${
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mt-1 ${
                task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                <FiFlag className="h-3 w-3" />
                {task.priority}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                isOverdue ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100'
              }`}>
                <FiCalendar className="h-3 w-3" />
                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-500 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
            title="Edit task"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-500 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
            title="Delete task"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;