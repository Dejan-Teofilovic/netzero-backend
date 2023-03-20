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
  try {
    const { firstName, lastName, email, password, userTypeId } = req.body;
    const currentDateTime = getCurrentDateTime();
    const user = await (
      await db.query("SELECT * FROM users WHERE email = ?;", [email])
    )[0];
    if (user) {
      return res.sendStatus(400);
    }

    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(password, salt);

    const { insertId } = await db.query(
      "INSERT INTO users (first_name, last_name, email, password, created_at, last_logged_at, id_user_type) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        firstName,
        lastName,
        email,
        cryptedPassword,
        currentDateTime,
        currentDateTime,
        userTypeId
      ]
    );

    const createdUser = await (
      await db.query("SELECT * FROM users WHERE id = ?;", [insertId])
    )[0];

    jwt.sign(
      { user: createdUser },
      config.get("jwtSecret"),
      { expiresIn: "5 days" },
      (error: Error, token: string) => {
        if (error) {
          return res.sendStatus(500);
        }
        return res.json(token);
      }
    );
  } catch (error) {
    console.log(">>>>>>>> error of signup => ", error);
    return res.sendStatus(500);
  }
};

/**
 * Check whether admin's access token is expired or not.
 */
export const checkExpirationOfToken = async (req: Request, res: Response) => {
  return res.sendStatus(200);
};
