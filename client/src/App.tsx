import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CounterArtifact from "./Counter.json";
import "./App.css";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const TARGET_COUNT = 10;

const App: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [count, setCount] = useState<number>(0);
  const [ownerName, setOwnerName] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [congratsMessage, setCongratsMessage] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);

          const signerInstance = await provider.getSigner();
          setSigner(signerInstance);

          const contractInstance = new ethers.Contract(
            contractAddress,
            CounterArtifact.abi,
            signerInstance
          );
          setContract(contractInstance);

          const currentCount = await contractInstance.getCount();
          setCount(Number(currentCount));

          const name = await contractInstance.ownerName();
          setOwnerName(name);

        } catch (error) {
          console.error("Falha ao conectar com a carteira:", error);
        }
      } else {
        console.log("Por favor, instale o MetaMask!");
      }
    };
    init();
  }, []);

  const updateCount = async () => {
    if (contract) {
      const newCount = await contract.getCount();
      const newCountNumber = Number(newCount);
      setCount(newCountNumber);

      if (newCountNumber === TARGET_COUNT) {
        setCongratsMessage(`Parabéns! Você atingiu ${TARGET_COUNT} adições.`);
      } else {
        setCongratsMessage("");
      }
    }
  };

  const increment = async () => {
    if (contract) {
      const tx = await contract.increment();
      await tx.wait();
      updateCount();
    }
  };

  const decrement = async () => {
    if (contract) {
      const tx = await contract.decrement();
      await tx.wait();
      updateCount();
    }
  };

  const resetCounter = async () => {
    if (contract) {
      const tx = await contract.reset();
      await tx.wait();
      updateCount();
    }
  };

  return (
    <div className="container">
      <h1>Contador feito por:</h1>
      <h1>{ownerName || "dono"}</h1>
      <p className="account-info">Conectado com a conta: {account}</p>
      <div className="counter-display">
        <span>Contador</span>
        <p>{count}</p>
      </div>
      {congratsMessage && (
        <div className="congrats-message">
          <p>{congratsMessage}</p>
        </div>
      )}
      <div className="buttons-container">
        <button onClick={increment} className="btn-increment">Aumentar +</button>
        <button onClick={decrement} className="btn-decrement">Diminuir -</button>
        <button onClick={resetCounter} className="btn-reset">Zerar</button>
      </div>
    </div>
  );
};

export default App;
