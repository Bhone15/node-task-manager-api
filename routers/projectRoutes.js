const express = require("express");

const router = new express.Router();

const {
  authroizePermissions,
  authenticateUser,
} = require("../middleware/authentication");

const {
  getAllProject,
  getSingleProject,
  updateProject,
  creatProject,
  deleteProject,
} = require("../controllers/projectController");

router
  .route("/")
  .get(authenticateUser, getAllProject)
  .post(authenticateUser, authroizePermissions("admin"), creatProject);
router
  .route("/:id")
  .get(authenticateUser, getSingleProject)
  .patch(authenticateUser, authroizePermissions("admin"), updateProject)
  .delete(authenticateUser, authroizePermissions("admin"), deleteProject);

module.exports = router;
