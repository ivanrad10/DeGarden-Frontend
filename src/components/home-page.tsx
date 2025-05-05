import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program, SensorHost, tokenMintPDA } from "../anchor/setup";
import { PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
export default function HomePage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const navigate = useNavigate();
  const { setVisible } = useWalletModal();
  const [sensorHost, setSensorHost] = useState<SensorHost | null | undefined>(
    undefined
  );

  const mySensors = () => {
    if (publicKey) {
      navigate(`/sensors/${publicKey.toBase58()}`);
    }
  };

  const exploreSensors = () => {
    if (publicKey) {
      navigate(`/explore-sensors`);
    }
  };

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

        console.log(fetched);

        setSensorHost(fetched);
      } catch (err) {
        console.log(err);

        console.log("failed");
        setSensorHost(null);
      }
    })();
  }, [publicKey]);

  const becomeHost = async () => {
    if (!publicKey) return;
    const [sensorHostStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("SENSOR_HOST"), publicKey.toBuffer()],
      program.programId
    );
    const hostTokenAta = await getAssociatedTokenAddress(
      tokenMintPDA,
      publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    const tx = await program.methods
      .addHost()
      .accountsStrict({
        host: publicKey,
        sensorHostState: sensorHostStatePDA,
        tokenMint: tokenMintPDA,
        hostTokenAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .transaction();
    await sendTransaction(tx, connection);
  };

  const handleConnectClick = async () => {
    try {
      setVisible(true);
    } catch (err) {
      console.error("Wallet connect failed:", err);
    }
  };

  return (
    <div className="home-page">
      <div className="text-section">
        <h1>
          Build and tokenize
          <br />
          AI agents on Solana
          <br />
          in under 1 minute
        </h1>
        <p>Seamlessly AI agent integration for your collection</p>
        <div className="main-page-buttons">
          <button className="primary-button" onClick={exploreSensors}>
            Explore sensors
          </button>
          {publicKey ? (
            sensorHost ? (
              <button className="primary-button" onClick={mySensors}>
                My sensors
              </button>
            ) : (
              <button className="primary-button" onClick={becomeHost}>
                Become a host
              </button>
            )
          ) : (
            <button className="primary-button" onClick={handleConnectClick}>
              Connect wallet
            </button>
          )}
        </div>
      </div>
      <div className="image-section">
        <img src={"../public/picture.svg"} alt="AI Agents in soil" />
      </div>
    </div>
  );
}
