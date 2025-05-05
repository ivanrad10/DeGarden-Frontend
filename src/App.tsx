import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "./App.css";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import MenuBar from "./components/menu-bar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SensorPage from "./components/sensor-page";
import HomePage from "./components/home-page";
import SwapTokens from "./components/swap-tokens-page";
import ExploreSensors from "./components/explore-sensors-page";

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      // if desired, manually define specific/custom wallets here (normally not required)
      // otherwise, the wallet-adapter will auto detect the wallets a user's browser has available
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <header>
              <Link to="/">
                <img src="../public/logo.svg" alt="Logo" className="logo" />
              </Link>
              <div className="controls">
                <MenuBar />
                <WalletMultiButton />
              </div>
            </header>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/swap-tokens" element={<SwapTokens />} />
              <Route path="/sensors/:hostAddress" element={<SensorPage />} />
              <Route path="/explore-sensors" element={<ExploreSensors />} />
            </Routes>
            <footer className="app-footer"></footer>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
