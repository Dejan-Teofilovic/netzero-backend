import { Request, Response } from "express";
import { getCurrentDateTime } from "../utils/functions";
import { IMyClaim, IMintableClaim, IClaim } from "../utils/interfaces";
const db = require("../utils/db");

/* Get the claims of a user */
export const getClaimsByUserId = (req: Request, res: Response) => {
  const { userId } = req.params;
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
    .then((results: Array<IMyClaim>) => {
      return res.json(results);
    })
    .catch((error: Error) => {
      console.log(">>>>>>>> error of getClaimByUserId => ", error);
      return res.sendStatus(500);
    });
};

/* Claim new tokens */
export const claim = async (req: Request, res: Response) => {
  const { tokenAmount, ethAmount, carbonAmount, feeAmount, walletAddressId } =
    req.body;
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
    return res.sendStatus(200);
  } catch (error) {
    console.log(">>>>>> error of claim => ", error);
    return res.sendStatus(500);
  }
};

/* Get mintable claims */
export const getMintableClaims = (req: Request, res: Response) => {
  db.query(
    `
      SELECT 
        claims.*,
        wallet_addresses.wallet_address,
        wallet_addresses.id_user,
        users.first_name AS user_first_name,
        users.last_name AS user_last_name
      FROM claims
      LEFT JOIN wallet_addresses ON claims.id_wallet_address = wallet_addresses.id
      LEFT JOIN users ON wallet_addresses.id_user = users.id
      WHERE claims.mintable_token_amount > 0;
    `
  )
    .then((results: Array<IMintableClaim>) => {
      return res.json(results);
    })
    .catch((error: Error) => {
      console.log(">>>>>>>> error of getClaimByUserId => ", error);
      return res.sendStatus(500);
    });
};

/* Get claim by its id */
export const getClaimById = (req: Request, res: Response) => {
  const { claimId } = req.params;
  db.query(
    `
    SELECT 
      claims.*, 
      wallet_addresses.wallet_address 
    FROM claims 
    LEFT JOIN wallet_addresses ON wallet_addresses.id = claims.id_wallet_address
    WHERE claims.id = ?;
  `,
    [Number(claimId)]
  )
    .then((results: Array<IMyClaim>) => {
      return res.json(results[0]);
    })
    .catch((error: Error) => {
      console.log(">>>>>>> error of getClaimById => ", error);
      return res.sendStatus(500);
    });
};
