import { useEffect, useState } from "react";
import "../styles/SwapPage.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { globalStatePDA, program, vaultPDA } from "../anchor/setup";
import { BN } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

import { tokenMintPDA, SensorHost } from "../anchor/setup";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function SwapTokens() {
  const [fromToken, setFromToken] = useState<"SOL" | "MYT">("SOL");
  const [toToken, setToToken] = useState<"SOL" | "MYT">("MYT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const [solBalance, setSolBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  const rate = 1 / 100;

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
    setToAmount("");
  };

  const { connected, connect, publicKey, sendTransaction, select } =
    useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    fetchBalance();
  }, [publicKey]);

  const handleConnectClick = async () => {
    try {
      setVisible(true);
    } catch (err) {
      console.error("Wallet connect failed:", err);
    }
  };

  const fetchBalance = async () => {
    if (!publicKey) {
      return;
    }
    const solBalance = await connection.getBalance(publicKey);

    setSolBalance(solBalance / 1e9);

    const tokenAddress = await getAssociatedTokenAddress(
      tokenMintPDA,
      publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const tokenAccountBalance = await connection.getTokenAccountBalance(
      tokenAddress
    );
    const rawAmount = parseFloat(tokenAccountBalance.value.amount);
    setTokenBalance(rawAmount / 1e9);
  };

  const buyTokens = async (amount: BN) => {
    if (!publicKey) return;

    const buyerTokenAta = await getAssociatedTokenAddress(
      tokenMintPDA,
      publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const tx = await program.methods
      .buyTokens(amount)
      .accountsStrict({
        buyer: publicKey,
        globalState: globalStatePDA,
        vault: vaultPDA,
        mint: tokenMintPDA,
        buyerTokenAta: buyerTokenAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  const sellTokens = async (amount: BN) => {
    if (!publicKey) return;

    const buyerTokenAta = await getAssociatedTokenAddress(
      tokenMintPDA,
      publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const tx = await program.methods
      .sellTokens(amount)
      .accountsStrict({
        seller: publicKey,
        globalState: globalStatePDA,
        vault: vaultPDA,
        mint: tokenMintPDA,
        sellerTokenAta: buyerTokenAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    const numeric = parseFloat(value);
    if (!isNaN(numeric)) {
      const converted = fromToken === "SOL" ? numeric / rate : numeric * rate;
      setToAmount(converted.toFixed(4));
    } else {
      setToAmount("");
    }
  };

  const handleSwap = async () => {
    const from = parseFloat(fromAmount);
    if (!from || isNaN(from)) return;

    if (fromToken === "SOL" && toToken === "MYT") {
      const tokens = new BN(from * LAMPORTS_PER_SOL * 100);
      await buyTokens(tokens);
    } else if (fromToken === "MYT" && toToken === "SOL") {
      const tokens = new BN(from * LAMPORTS_PER_SOL);
      await sellTokens(tokens);
    }

    setFromAmount("");
    setToAmount("");

    // TODO: event from contract
    // TODO: spinner, transaction completed pop
    await fetchBalance();
  };

  return (
    <div className="swap-container">
      <h2>Swap</h2>
      <div className="swap-box">
        <div className="token-row">
          <div className="token-controls">
            <select value={fromToken} disabled>
              <option value="SOL">SOL</option>
              <option value="MYT">MYT</option>
            </select>
            <input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={handleFromAmountChange}
            />
          </div>
          <div className="balance">
            Balance:{" "}
            {fromToken === "SOL"
              ? solBalance.toFixed(4)
              : tokenBalance.toFixed(2)}{" "}
            {fromToken}
          </div>
        </div>

        <div className="switch-button" onClick={handleSwitch}>
          ⇅
        </div>

        <div className="token-row">
          <div className="token-controls">
            <select value={toToken} disabled>
              <option value="SOL">SOL</option>
              <option value="MYT">MYT</option>
            </select>
            <input type="number" value={toAmount} readOnly placeholder="0.00" />
          </div>
          <div className="balance">
            Balance:{" "}
            {toToken === "SOL"
              ? solBalance.toFixed(4)
              : tokenBalance.toFixed(2)}{" "}
            {toToken}
          </div>
        </div>

        <div className="rate-info">
          1 {toToken} ={" "}
          {toToken === "MYT" ? rate.toFixed(2) : (1 / rate).toFixed(2)}{" "}
          {fromToken}
        </div>

        {connected ? (
          <button className="swap-button" onClick={handleSwap}>
            Swap
          </button>
        ) : (
          <div className="wallet-as-swap">
            <button className="swap-button" onClick={handleConnectClick}>
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
