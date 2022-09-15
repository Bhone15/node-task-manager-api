const express = require("express");
const router = new express.Router();

const {
  authroizePermissions,
  authenticateUser,
} = require("../middleware/authentication");

const {
  getAllSubTaskPerProject,
  getSingleSubTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} = require("../controllers/subTaskController");

router
  .route("/")
  .get(authenticateUser, getAllSubTaskPerProject)
  .post(authenticateUser, authroizePermissions("admin"), createSubTask);

router
  .route("/:id")
  .get(authenticateUser, getSingleSubTask)
  .patch(authenticateUser, updateSubTask)
  .delete(authenticateUser, authroizePermissions("admin"), deleteSubTask);

module.exports = router;
