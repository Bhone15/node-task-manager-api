const CustomError = require("../errors");
const calculateDuration = (startDate, endDate) => {
  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    throw new CustomError.BadRequestError(
      "End date should be greater than start date"
    );
  }
  const duration = Math.abs(new Date(startDate) - new Date(endDate));
  if (duration === 0) {
    throw new CustomError.BadRequestError(
      "Start date and end date cann't be same"
    );
  }
  return duration;
};

module.exports = calculateDuration;
