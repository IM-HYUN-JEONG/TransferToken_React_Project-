import React, { useState } from "react";
import "./App.css";
import Klip from "./components/Klip";
import SendKLAY from "./components/SendKLAY";
import Token from "./components/Token";

export default function App() {
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState(null);

  return (
    <div className="App">
      <Klip address={address} setAddress={setAddress} setBalance={setBalance} />
      <SendKLAY address={address} balance={balance} />
      <Token address={address} />
    </div>
  );
}
