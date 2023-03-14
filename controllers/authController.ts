import { Request, Response } from "express";
import { getCurrentDateTime } from "../utils/functions";
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");

/**
 * Admin login
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const currentDateTime = getCurrentDateTime();
  const user = await (
    await db.query("SELECT * FROM users WHERE email = ?;", [email])
  )[0];

  if (!user) {
    return res.sendStatus(404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.sendStatus(403);
  }

  await db.query("UPDATE users SET last_logged_at = ?;", [currentDateTime]);

  jwt.sign(
    { user },
    config.get("jwtSecret"),
    { expiresIn: "5 days" },
    (error: Error, token: string) => {
      if (error) {
        return res.sendStatus(500);
      }
      return res.json(token);
    }
  );
};

/**
 * Admin signup
 */
export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const currentDateTime = getCurrentDateTime();
  const user = await (
    await db.query("SELECT * FROM users WHERE email = ?;", [email])
  )[0];
  if (user) {
    return res.sendStatus(400);
  }

  const salt = await bcrypt.genSalt(10);
  const cryptedPassword = await bcrypt.hash(password, salt);

  db.query(
    "INSERT INTO users (first_name, last_name, email, password, created_at, last_logged_at) VALUES (?, ?, ?, ?, ?, ?);",
    [
      firstName,
      lastName,
      email,
      cryptedPassword,
      currentDateTime,
      currentDateTime,
    ]
  )
    .then(() => {
      jwt.sign(
        { ...req.body },
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (error: Error, token: string) => {
          if (error) {
            return res.sendStatus(500);
          }
          return res.json(token);
        }
      );
    })
    .catch((error: Error) => {
      return res.sendStatus(500);
    });
};

/**
 * Check whether admin's access token is expired or not.
 */
export const checkExpirationOfToken = async (req: Request, res: Response) => {
  return res.sendStatus(200);
};
