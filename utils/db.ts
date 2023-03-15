import ServerlessMysql from "serverless-mysql";
import { DB_PORT } from "./constants";

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

const db = ServerlessMysql({
  config: {
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT
  }
});

module.exports = db;
