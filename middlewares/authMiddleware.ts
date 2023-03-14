import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req: Request, res: Response, next: Function) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    jwt.verify(token, config.get("jwtSecret"), (error: Error, decoded: any) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        // req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
