import User from "../model/User.js";

const isAdmin = async (req, res, next) => {
  // FIND THE LOGIN USER
  const user = await User.findById(req.userAuthId);
  //  CHECK IF ADMIN
  if (user.isAdmin) {
    next();
  } else {
    next(new Error("Access denied, Admin only"));
  }
};

export default isAdmin;
