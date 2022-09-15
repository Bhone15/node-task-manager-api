const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router
  .route("/")
  .post(authenticateUser, createTask)
  .get(authenticateUser, getAllTasks);
router
  .route("/:id")
  .get(authenticateUser, getTask)
  .patch(authenticateUser, updateTask)
  .delete(authenticateUser, deleteTask);

module.exports = router;
