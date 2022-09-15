const { StatusCodes } = require("http-status-codes");
const Project = require("../models/Project");
const SubTask = require("../models/SubTask");
const User = require("../models/User");
const CustomError = require("../errors");
const { checkPermissionForSubTask } = require("../utils");

const createSubTask = async (req, res) => {
  const { title, description, member: memberId, project: projectID } = req.body;
  req.body.createdBy = req.user.userId;
  const project = await Project.findOne({ _id: projectID });
  const projectMember = project.members;
  const projectMemberIdArray = projectMember.map((member) => {
    return member.toString();
  });
  if (!projectMemberIdArray.includes(memberId)) {
    throw new CustomError.BadRequestError(
      `User ${memberId} id is not a member of the project`
    );
  }
  const member = await User.findOne({ _id: memberId }).select("-password");
  const startDate = project.startDate;
  const endDate = project.endDate;
  const duration = project.duration;
  const subTask = await SubTask.create({
    title,
    description,
    member: memberId,
    project: projectID,
    startDate,
    endDate,
    duration,
    createdBy: req.body.createdBy,
  });
  subTask.member = member;
  res.status(StatusCodes.CREATED).json({ subTask });
};

const getAllSubTaskPerProject = async (req, res) => {
  const queryObject = {};
  const { project, member } = req.query;
  if (project) {
    queryObject.project = project;
  }
  if (member) {
    if (req.user.role !== "admin") {
      throw new CustomError.UnauthorizedError(
        "You are not allow to this route"
      );
    }
    queryObject.member = member;
  }
  const subTask = await SubTask.find(queryObject);
  await Promise.all(
    subTask.map(async (task) => {
      const user = await User.findById({ _id: task.member }).select(
        "-password"
      );
      task.member = user;
    })
  );
  res.status(StatusCodes.OK).json({ subTask });
};

const getSingleSubTask = async (req, res) => {
  const { id: taskId } = req.params;
  const subTask = await SubTask.findOne({ _id: taskId });
  if (!subTask) {
    throw new CustomError.NotFoundError(`No Sub Task found with id ${taskId}`);
  }
  checkPermissionForSubTask(req.user, subTask.member);
  const user = await User.findById({ _id: subTask.member }).select("-password");
  subTask.member = user;
  res.status(StatusCodes.OK).json({ subTask });
};

const updateSubTask = async (req, res) => {
  const {
    params: { id: taskId },
    body: { title, description, member, status },
  } = req;
  // have to fetch first to check the autourization
  const task = await SubTask.findById({ _id: taskId });
  checkPermissionForSubTask(req.user, task.member);
  let subTask;
  if (req.user.role === "admin") {
    if (!title || !description || !member) {
      throw new CustomError.BadRequestError(
        "Title, Description, Member are required"
      );
    }
    req.body.createdBy = req.user.userId;
    subTask = await SubTask.findByIdAndUpdate(
      { _id: taskId },
      { title, description, member, status },
      { new: true, runValidators: true }
    );
  }

  if (req.user.role === "user") {
    subTask = await SubTask.findByIdAndUpdate(
      { _id: taskId },
      { status },
      { new: true, runValidators: true }
    );
  }
  // not working this if block one have to handle later
  if (!subTask) {
    throw new CustomError.NotFoundError(`No Sub Task found with id ${taskId}`);
  }
  const user = await User.findById({ _id: subTask.member }).select("-password");
  subTask.member = user;
  res.status(StatusCodes.OK).json({ subTask });
};

const deleteSubTask = async (req, res) => {
  const { id: taskId } = req.params;
  const subTask = await SubTask.findOneAndRemove({ _id: taskId });
  if (!subTask) {
    throw new CustomError.NotFoundError(`No Sub Task found with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getAllSubTaskPerProject,
  getSingleSubTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
};
