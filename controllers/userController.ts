import { Request, Response } from "express";
import { IUserType } from "../utils/interfaces";
const db = require("../utils/db");

export const getUserTypes = (req: Request, res: Response) => {
  db.query("SELECT * FROM user_types;")
    .then((results: Array<IUserType>) => {
      return res.json(results);
    })
    .catch((error: Error) => {
      console.log(">>>>>>>>> error of getUserTypes => ", error);
      return res.sendStatus(500);
    });
};
