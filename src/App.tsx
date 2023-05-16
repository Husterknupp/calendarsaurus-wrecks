import React, { ReactElement, useEffect, useState } from "react";
import "./App.css";
import dayjs from "dayjs";
import LOCALE_DE from "dayjs/locale/de";

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
  const [date, setDate] = useState(dayjs());

  useEffect(() => {
    function refreshDate() {
      setDate(dayjs());
    }
    const id = setInterval(refreshDate, TIME_1SEC);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <h1 className={"weekday"}>
        {date.locale(LOCALE_DE.name).format("dddd")}
      </h1>
      <div className={"date"}>
        {date.locale(LOCALE_DE.name).format("D. MMM YYYY")}
      </div>
    </>
  );
}

export default App;
