import { Request, Response } from "express";
const db = require("../utils/db");

/* Connect wallet */
export const connectWallet = async (req: Request, res: Response) => {
  const { userId, walletAddress } = req.body;
  try {
    const existedWalletAddress = (
      await db.query(
        "SELECT * FROM wallet_addresses WHERE id_user = ? AND wallet_address = ?;",
        [userId, walletAddress]
      )
    )[0];

    if (existedWalletAddress) {
      return res.json(existedWalletAddress);
    } else {
      const { insertId } = await db.query(
        "INSERT INTO wallet_addresses(id_user, wallet_address) VALUES(?, ?);",
        [userId, walletAddress]
      );
      return res.json({
        id: insertId,
        id_user: userId,
        wallet_address: walletAddress
      });
    }
  } catch (error) {}
};
