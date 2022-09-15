const CustomError = require("../errors");

const checkPermission = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof requestUser);
  // console.log(typeof resourceUserId);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};

const checkProjectAccessedUser = (requestUser, project) => {
  if (requestUser.role === "admin") return;
  const memberIdArray = project.members.map((member) => {
    return member._id.toString();
  });
  if (memberIdArray.includes(requestUser.userId)) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};

const checkPermissionForSubTask = (requestUser, taskMember) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === taskMember.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};

module.exports = {
  checkPermission,
  checkProjectAccessedUser,
  checkPermissionForSubTask,
};
