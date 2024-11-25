import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  // GET TOKEN FROM HEADER
  const token = getTokenFromHeader(req);

  // VERIFY THE TOKEN
  const decodedUser = verifyToken(token);

  // SAVE THE USER INTRO REQ OBJ
  if (!decodedUser) {
    throw new Error("Invalid/Expired token, Please try again");
  } else {
    req.userAuthId = decodedUser?.id;
    next();
  }
};
