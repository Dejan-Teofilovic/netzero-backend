import { Request, Response } from "express";
import { getCurrentDateTime } from "../utils/functions";
import { IClaim } from "../utils/interfaces";
const db = require("../utils/db");

/* Get the claims of a user */
export const getClaimsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.body;
  db.query(
    `
      SELECT 
        claims.*,
        wallet_addresses.wallet_address
      FROM claims
      LEFT JOIN wallet_addresses ON claims.id_wallet_address = wallet_addresses.id
      LEFT JOIN users ON wallet_addresses.id_user = users.id
      WHERE users.id = ?;
    `,
    [userId]
  )
    .then((results: Array<IClaim>) => {
      return res.json(results);
    })
    .catch((error: Error) => {
      console.log(">>>>>>>> error of getClaimByUserId => ", error);
      return res.sendStatus(500);
    });
};

/* Claim new tokens */
export const claim = async (req: Request, res: Response) => {
  const { tokenAmount, ethAmount, carbonAmount, feeAmount, userId } = req.body;
  const { walletAddressId } = req.params;
  const currentDateTime = getCurrentDateTime();

  try {
    await db.query(
      "INSERT INTO claims(id_wallet_address, token_amount, eth_amount, carbon_amount, fee_amount, mintable_token_amount, created_at) VALUES(?, ?, ?, ?, ?, ?, ?);",
      [
        walletAddressId,
        tokenAmount,
        ethAmount,
        carbonAmount,
        feeAmount,
        tokenAmount,
        currentDateTime
      ]
    );
    await db.query(
      `
        SELECT 
          claims.*,
          wallet_addresses.wallet_address
        FROM claims
        LEFT JOIN wallet_addresses ON claims.id_wallet_address = wallet_addresses.id
        LEFT JOIN users ON wallet_addresses.id_user = users.id
        WHERE users.id = ?;
      `,
      [userId]
    );
  } catch (error) {
    console.log(">>>>>> error of claim => ", error);
    return res.sendStatus(500);
  }
};
