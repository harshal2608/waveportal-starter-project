import * as React from "react";
// import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const wave = () => {};

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Hello there!</div>

        <div className="bio">I am Harshal and I am trying Web3!</div>

        <button className="waveButton" onClick={wave}>
          Help at Me
        </button>
      </div>
    </div>
  );
}
