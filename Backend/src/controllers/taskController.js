import Task from '../models/Task.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority = 'medium', dueDate, status = 'pending' } = req.body;
    const userId = req.user.userId;

    const task = await Task.create({
      userId,
      title: title.trim(),
      description: description?.trim() || undefined,
      priority,
      dueDate: new Date(dueDate),
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, dueDate, status } = req.body;
    const userId = req.user.userId;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (trimmedTitle) {
        task.title = trimmedTitle;
      }
    }
    if (description !== undefined) {
      task.description = description?.trim() || undefined;
    }
    if (priority !== undefined) {
      task.priority = priority;
    }
    if (dueDate !== undefined) {
      const parsedDate = new Date(dueDate);
      if (!isNaN(parsedDate.getTime())) {
        task.dueDate = parsedDate;
      }
    }
    if (status !== undefined) {
      task.status = status;
    }

    // Validate the task before saving
    const validationError = task.validateSync();
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationError.message
      });
    }

    const updatedTask = await task.save({ timestamps: true });

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    } else {
      next(error);
    }
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      res.status(404).json({
        success: true,
        message: 'Task not found',
      });
      return;
    }

    await Task.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};