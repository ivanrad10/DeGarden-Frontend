import { Idl, IdlAccounts, Program } from "@coral-xyz/anchor";
import { DeGarden } from "./de_garden";
import IDL from "./idl.json";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program<DeGarden>(IDL as DeGarden, {
  connection,
});

export const [globalStatePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("GLOBAL_STATE")],
  program.programId,
);

export const [tokenMintPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("TOKEN_MINT")],
  program.programId,
);

export const [vaultPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("VAULT")],
  program.programId,
);

// This is just a TypeScript type for the Counter data structure based on the IDL
// We need this so TypeScript doesn't yell at us
export type GlobalStateData = IdlAccounts<DeGarden>["globalState"];
export type SensorHost = IdlAccounts<DeGarden>["sensorHost"];