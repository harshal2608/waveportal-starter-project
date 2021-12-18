import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWave, setTotalWave] = useState(0);

  const contractAddress = "0x61c9e0c1c4d0a744a8f62c88674e7642a7cebb62";
  const contractABI = abi.abi;

  const getInitialWaves = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrived total wave count...", count.toNumber());
        setTotalWave(count.toNumber());
      } else {
        console.log("Ethereum OBject doesn;t exist");
      }
    } catch (error) {
      console.log(error);
    }
  }, [contractABI]);

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // let count = await wavePortalContract.getTotalWaves();
        // console.log("Retrived total wave count...", count.toNumber());
        // setTotalWave(count);
        getInitialWaves();

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWave(count.toNumber());
      } else {
        console.log("Ethereum OBject doesn;t exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MEtasmask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getInitialWaves();
  }, [getInitialWaves]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Well, Hello there ser!</div>

        <div className="bio">I am Harshal and I am trying Web3!</div>
        <div className="bio">total {totalWave} have waved at me</div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
