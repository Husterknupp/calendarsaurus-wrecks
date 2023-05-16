import React, { ReactElement, useEffect, useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DateCpt />
        <div className={"today-info"}>
          Heute kein Mittagessen - wir holen dich 11:30 Uhr bei dir Zuhause ab.
        </div>
      </header>
    </div>
  );
}

const TIME_1SEC = 1000;

function DateCpt(): ReactElement {
  const [date, setDate] = useState(new Date().toString());

  useEffect(() => {
    function refreshDate() {
      setDate(new Date().toString());
    }
    const id = setInterval(refreshDate, TIME_1SEC);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <h1 className={"weekday"}>Montag</h1>
      <div className={"date"}>{date}</div>
    </>
  );
}

export default App;
