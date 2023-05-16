import React, { ReactElement, useEffect, useState } from "react";
import "./App.css";
import dayjs from "dayjs";
import LOCALE_DE from "dayjs/locale/de";

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

async function httpGet<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("GET", url);
    req.onload = function () {
      if (this.status.toString().startsWith("2")) {
        resolve(this.response);
      } else {
        reject(`${this.status}: ${this.statusText}`);
      }
    };
    req.send();
  });
}
//
// type Message = {
//   date: string; // 2023-05-11
//   message: string;
// };

const TIME_1MIN = 60000;

function MessageCpt(): ReactElement | null {
  const [messages, setMessages] = useState<string>();

  useEffect(() => {
    function doRequest() {
      httpGet<string>("messages-encrypted.txt").then(setMessages).catch(alert);
    }

    doRequest();

    const id = setInterval(doRequest, TIME_1MIN);
    return () => clearInterval(id);
  }, []);

  return messages ? (
    <div className={"today-info"}>{messages?.slice(0, 23) + "..."}</div>
  ) : null;
}

export default App;
