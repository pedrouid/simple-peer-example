import React from "react";
import Peer from "simple-peer";

import logo from "./logo.svg";
import "./App.css";

let interval: any;
let counter = 0;

function startPinging(peer: Peer.Instance) {
  interval = setInterval(() => {
    peer.send(`new message sent at ${Date.now()}`);
    counter += 1;
    if (counter === 10) {
      clearInterval(interval);
    }
  }, 5000);
}

function init() {
  var peer1 = new Peer({ initiator: true });
  var peer2 = new Peer();

  peer1.on("signal", (data) => {
    console.log("[peer1]", "signal", data);
    // when peer1 has signaling data, give it to peer2 somehow
    peer2.signal(data);
  });

  peer2.on("signal", (data) => {
    console.log("[peer2]", "signal", data);
    // when peer2 has signaling data, give it to peer1 somehow
    peer1.signal(data);
  });

  peer1.on("connect", () => {
    console.log("[peer1]", "connect");
    // wait for 'connect' event before using the data channel
    peer1.send("hey peer2, how is it going?");
    startPinging(peer1);
  });

  peer2.on("data", (data) => {
    console.log("[peer2]", "data", data.toString());
    // got a data channel message
  });
}

function App() {
  init();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{`open console.log to view simple-peer in action`}</p>
      </header>
    </div>
  );
}

export default App;
