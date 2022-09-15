const Task = require("../models/Task");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
};

const getTask = async (req, res) => {
  const {
    params: { id: taskId },
    user: { userId },
  } = req;
  const task = await Task.findOne({ _id: taskId, createdBy: userId });
  if (!task) {
    throw new CustomError.NotFoundError(`No tasks found with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};

const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const task = await Task.create({ ...req.body });
  res.status(StatusCodes.OK).json({ task });
};

const updateTask = async (req, res) => {
  const {
    params: { id: taskId },
    user: { userId },
    body: { title, description, status },
  } = req;

  if (!title || !description) {
    throw new CustomError.BadRequestError(
      "Title or Description fields cannot be empty"
    );
  }
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    { title, description, status },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new CustomError.NotFoundError(`No tasks found with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};

const deleteTask = async (req, res) => {
  const {
    params: { id: taskId },
    user: { userId },
  } = req;
  const task = await Task.findOneAndRemove({ _id: taskId, createdBy: userId });
  if (!task) {
    throw new CustomError.NotFoundError(`No tasks found with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { getAllTasks, getTask, createTask, updateTask, deleteTask };
