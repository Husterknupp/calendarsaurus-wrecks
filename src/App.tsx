import React, { ReactElement, useEffect, useState } from "react";
import "./App.css";
import dayjs from "dayjs";
import LOCALE_DE from "dayjs/locale/de";
import axios from "axios";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DateCpt />
        <MessageCpt />
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

function MessageCpt(): ReactElement | null {
  const [messages, setMessages] = useState<string>();
  useEffect(() => {
    try {
      axios
        .get("messages-encrypted.txt")
        .then((result) => setMessages(result.data));
    } catch (e) {
      alert(e);
    }
  }, []);

  return <div className={"today-info"}>{messages}</div>;
}

export default App;
