import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { program, tokenMintPDA, SensorHost } from "../anchor/setup";

export default function MenuBar() {
  const { connection } = useConnection();
  const navigate = useNavigate();
  const { publicKey, sendTransaction } = useWallet();

  const [sensorHost, setSensorHost] = useState<SensorHost | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!publicKey) {
      setSensorHost(undefined);
      return;
    }
    (async () => {
      try {
        const [pda] = PublicKey.findProgramAddressSync(
          [Buffer.from("SENSOR_HOST"), publicKey.toBuffer()],
          program.programId
        );
        const fetched = await program.account.sensorHost.fetch(pda);
        setSensorHost(fetched);
      } catch {
        setSensorHost(null);
      }
    })();
  }, [publicKey, program]);

  const swapTokens = () => {
    navigate(`/swap-tokens`);
  };

  return (
    <>
      <button className="menu-button" onClick={swapTokens}>
        Swap tokens
      </button>
      <button className="menu-button">Whitepaper</button>
      <button className="menu-button">About us</button>
    </>
  );
}
