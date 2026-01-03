import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header/Header.jsx';
import { getTasks as getTasksAPI, createTask as createTaskAPI, 
         updateTask as updateTaskAPI, deleteTask as deleteTaskAPI } from '../api/tasks.js';
import TaskItem from '../components/Task/TaskItem.jsx';
import TaskForm from '../components/Task/TaskForm.jsx';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const result = await getTasksAPI();
      if (result.success) {
        setTasks(result.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      const result = await createTaskAPI(taskData);
      if (result.success) {
        setTasks(prev => [result.data, ...prev]);
        setShowCreateModal(false);
        Swal.fire('Success', 'Task created successfully!', 'success');
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      const result = await updateTaskAPI(editingTask._id, taskData);
      if (result.success) {
        setTasks(prev => 
          prev.map(t => t._id === editingTask._id ? result.data : t)
        );
        setEditingTask(null);
        Swal.fire('Success', 'Task updated successfully!', 'success');
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to update task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      const result = await updateTaskAPI(task._id, { status: newStatus });
      if (result.success) {
        setTasks(prev => 
          prev.map(t => t._id === task._id ? result.data : t)
        );
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      text: 'Are you sure you want to delete this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    });

    if (result.isConfirmed) {
      try {
        const result = await deleteTaskAPI(taskId);
        if (result.success) {
          setTasks(prev => prev.filter(t => t._id !== taskId));
          Swal.fire('Deleted!', 'Task has been deleted.', 'success');
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete task', 'error');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-2">Manage your daily tasks efficiently</p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            Create Task
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'pending' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({tasks.filter(t => t.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completed ({tasks.filter(t => t.status === 'completed').length})
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No tasks found</p>
            <p className="text-gray-400 mt-2">
              {filter === 'completed' 
                ? "You haven't completed any tasks yet." 
                : "Create your first task to get started!"}
            </p>
          </div>
        ) : (
          <div>
            {filteredTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={(task) => setEditingTask(task)}
                onDelete={handleDeleteTask}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Create New Task</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              <TaskForm 
                task={null}
                onSubmit={handleCreateTask}
                onCancel={() => setShowCreateModal(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
                <button 
                  onClick={() => setEditingTask(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              <TaskForm 
                task={editingTask}
                onSubmit={handleUpdateTask}
                onCancel={() => setEditingTask(null)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
