import jwt from "jsonwebtoken";
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_key, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
};
