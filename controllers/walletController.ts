import { ethers } from "ethers";
import { Request, Response } from "express";
import {
  ADMIN_WALLET_ADDRESS,
  CHAIN_ID,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  RPC_URL
} from "../utils/constants";
import { getCurrentDateTime } from "../utils/functions";
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

/* Enable mint */
export const enableMint = async (req: Request, res: Response) => {
  const { PRIVATE_KEY_OF_ADMIN_WALLET } = process.env;

  try {
    const network = ethers.providers.getNetwork(CHAIN_ID);
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL, network);
    const signer = new ethers.Wallet(
      PRIVATE_KEY_OF_ADMIN_WALLET || "",
      provider
    );
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    const tx = await contract.setMintable(true, { from: signer.address });
    await tx.wait();
    return res.sendStatus(200);
  } catch (error) {
    console.log(">>>>>>> error of enableMint => ", error);
    return res.sendStatus(500);
  }
};

/* Send Ethereum to the offsetter's wallet */
export const sendEthToOffsetter = async (req: Request, res: Response) => {
  const {
    claimId,
    walletAddress,
    ethAmount,
    feeAmount,
    tokenAmount,
    carbonAmount,
    claimedTokenAmount
  } = req.body;
  const { PRIVATE_KEY_OF_ADMIN_WALLET } = process.env;
  console.log(">>>>>>> req.body => ", req.body);
  try {
    const network = ethers.providers.getNetwork(CHAIN_ID);
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL, network);
    const signer = new ethers.Wallet(
      PRIVATE_KEY_OF_ADMIN_WALLET || "",
      provider
    );
    const tx = await signer.sendTransaction({
      to: walletAddress,
      value: ethers.utils.parseEther(`${Number(ethAmount) - Number(feeAmount)}`)
    });
    await tx.wait();

    const currentDateTime = getCurrentDateTime();
    await db.query(
      `
      INSERT INTO offset_projects(id_claim, eth_amount, carbon_amount, token_amount, fee_amount, created_at)
      VALUES(?, ?, ?, ?, ?, ?);
    `,
      [
        Number(claimId),
        Number(ethAmount),
        Number(carbonAmount),
        Number(tokenAmount),
        Number(feeAmount),
        currentDateTime
      ]
    );
    await db.query(
      "UPDATE claims SET mintable_token_amount = ? WHERE id = ?;",
      [Number(claimedTokenAmount) - Number(tokenAmount), claimId]
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(">>>>>>> error of enableMint => ", error);
    return res.sendStatus(500);
  }
};
