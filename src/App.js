import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWave, setTotalWave] = useState(0);
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");

  const contractAddress = "0x71025563E4e08292b587535B0Aa26b5229f4b810";
  const contractABI = abi.abi;

  const getAllWaves = useCallback(async () => {
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
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum Object does not exist");
      }
    } catch (e) {
      console.log(e);
    }
  }, [contractABI]);

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
        console.log("Ethereum OBject doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }, [contractABI]);

  const wave = async (event) => {
    event.preventDefault();

    console.log(message);
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
        console.log(message);
        const waveTxn = await wavePortalContract.wave(message);
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

  const checkIfWalletIsConnected = useCallback(async () => {
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
        getAllWaves();
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }, [getAllWaves]);

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
  }, [checkIfWalletIsConnected, getInitialWaves]);

  const messageHandler = (event) => {
    setMessage(event.target.value);
  };
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Well, Hello there ser!</div>

        <div className="bio">I am Harshal and I am trying Web3!</div>
        <div className="bio">total {totalWave} have waved at me</div>

        <form onSubmit={wave}>
          <input
            type="text"
            name="message"
            onChange={messageHandler}
            className="message"
            autoFocus
          />

          <button className="waveButton">Wave at Me</button>
        </form>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div className="wrapper">
          {allWaves.reverse().map((wave, index) => {
            return (
              <div key={index} className="data">
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
