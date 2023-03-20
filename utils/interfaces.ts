export interface IOkPacket {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

export interface IUserType {
  id: number;
  type: string;
}

export interface IMyClaim {
  id: number;
  id_wallet_address: number;
  wallet_address: string;
  token_amount: number;
  eth_amount: number;
  carbon_amount: number;
  fee_amount: number;
  mintable_token_amount: number;
  created_at: string;
  updated_at: string;
}

export interface IMintableClaim {
  id: number;
  id_wallet_address: number;
  id_user: number;
  user_first_name: string;
  user_last_name: string;
  wallet_address: string;
  token_amount: number;
  eth_amount: number;
  carbon_amount: number;
  fee_amount: number;
  mintable_token_amount: number;
  created_at: string;
  updated_at: string;
}

export interface IClaim {
  id: number;
  id_wallet_address: number;
  token_amount: number;
  eth_amount: number;
  carbon_amount: number;
  fee_amount: number;
  mintable_token_amount: number;
  created_at: string;
  updated_at: string;
}
