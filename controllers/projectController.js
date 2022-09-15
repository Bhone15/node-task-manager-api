const Project = require("../models/Project");
const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkProjectAccessedUser, calculateDuration } = require("../utils");

const getSingleProject = async (req, res) => {
  const { id: projectId } = req.params;
  const project = await Project.findOne({ _id: projectId });
  if (!project) {
    throw new CustomError.NotFoundError(`No tasks found with id ${id}`);
  }
  project.members = await User.find({ _id: project.members }).select(
    "-password"
  );
  checkProjectAccessedUser(req.user, project);
  res.send({ project });
};

const getAllProject = async (req, res) => {
  const project = await Project.find({});
  await Promise.all(
    project.map(async (p) => {
      const user = await User.find({ _id: p.members }).select("-password");
      p.members = user;
    })
  );
  res.status(StatusCodes.OK).json(project);
};

const creatProject = async (req, res) => {
  const { members, startDate, endDate } = req.body;
  if (!members || members.length === 0) {
    throw new CustomError.BadRequestError(
      "Please provide at least one member with array"
    );
  }
  req.body.createdBy = req.user.userId;
  req.body.duration = calculateDuration(startDate, endDate); // return milisecond and all validation contain this function.
  const project = await Project.create({ ...req.body });
  const memberIdArray = project.members;
  const users = await User.find({ _id: memberIdArray }).select("-password");
  project.members = users;
  res.status(StatusCodes.CREATED).json({ project });
};

const updateProject = async (req, res) => {
  const {
    params: { id: projectId },
    body: { name, description, startDate, endDate, status, members },
  } = req;

  if (!name || !description || !startDate || !endDate || !members) {
    throw new CustomError.BadRequestError(
      "Title, Description, Start Date, End Date, Members are required"
    );
  }
  if (!members || members.length === 0) {
    throw new CustomError.BadRequestError(
      "Please provide at least one member with array"
    );
  }
  req.body.createdBy = req.user.userId;
  req.body.duration = calculateDuration(startDate, endDate);
  const project = await Project.findOneAndUpdate(
    { _id: projectId },
    { name, description, startDate, endDate, status, members },
    { new: true, runValidators: true }
  );
  if (!project) {
    throw new CustomError.NotFoundError(
      `No projects found with id ${projectId}`
    );
  }
  const memberIdArray = project.members;
  const users = await User.find({ _id: memberIdArray }).select("-password");
  project.members = users;
  res.status(StatusCodes.OK).json({ project });
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findOneAndRemove({ _id: id });
  if (!project) {
    throw new CustomError.NotFoundError(`No projects found with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getAllProject,
  getSingleProject,
  creatProject,
  deleteProject,
  updateProject,
};
