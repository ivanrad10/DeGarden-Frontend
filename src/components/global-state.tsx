import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { program, globalStatePDA, GlobalStateData } from "../anchor/setup";

export default function GlobalState() {
  const { connection } = useConnection();
  const [globalStateData, setGlobalStateData] = useState<GlobalStateData | null>(null);

  useEffect(() => {
    const fetchGlobalStateData = async () => {
      try {
        const data = await program.account.globalState.fetch(globalStatePDA);
        setGlobalStateData(data);
      } catch (error) {
        console.error("Error fetching global state data:", error);
      }
    };

    fetchGlobalStateData();
  }, [program, globalStatePDA, connection]);

  return <p className="text-lg">Count: {globalStateData?.tokenPriceInLamports?.toString()}</p>;
}