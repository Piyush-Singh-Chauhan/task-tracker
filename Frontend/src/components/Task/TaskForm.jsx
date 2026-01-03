import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const TaskForm = ({ task, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: task.status || 'pending'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        status: 'pending'
      });
    }
    setErrors({});
    setTouchedFields({});
  }, [task]);

  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      validate();
    }
  }, [formData, touchedFields]);

  const validate = () => {
    const newErrors = {};

    if (touchedFields.title || formData.title.trim()) {
      if (!formData.title.trim()) {
        newErrors.title = 'Task title is required';
      } else if (formData.title.trim().length < 2) {
        newErrors.title = 'Task title must be at least 2 characters';
      }
    }

    if (touchedFields.dueDate || formData.dueDate) {
      if (!formData.dueDate) {
        newErrors.dueDate = 'Due date is required';
      } else {
        const selectedDate = new Date(formData.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.dueDate = 'Due date cannot be in the past';
        }
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0 && formData.title.trim().length >= 2 && formData.dueDate;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors if any
    setTouchedFields({
      title: true,
      dueDate: true
    });
    
    if (validate()) {
      onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={() => handleBlur('title')}
            className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter task title"
          />
          {touchedFields.title && errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="input w-full"
            placeholder="Enter task description (optional)"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            onBlur={() => handleBlur('dueDate')}
            min={new Date().toISOString().split('T')[0]}
            className={`input w-full ${errors.dueDate ? 'border-red-500' : ''}`}
          />
          {touchedFields.dueDate && errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`btn flex-1 ${isFormValid && !isSubmitting ? 'btn-primary' : 'btn-primary opacity-50 cursor-not-allowed'}`}
        >
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;