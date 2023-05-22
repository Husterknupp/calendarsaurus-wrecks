import React, { ReactElement, useEffect, useState } from "react";
import "./App.css";
import dayjs from "dayjs";
import LOCALE_DE from "dayjs/locale/de";
import { AES, enc } from "crypto-js";

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

    // Default Accept header value is `text/html` and the proxy doesn't forward those requests (see https://create-react-app.dev/docs/proxying-api-requests-in-development/).
    // That is a problem because I can't use the same url in development and in production.
    // Not all requests are json, obviously. However, I'm not sure, I should care here.
    // `application/octet-stream` would be the canonical 'generic data' MIME type.
    req.setRequestHeader("Accept", "application/json");

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

type Message = {
  date: string; // 2023-05-11
  message: string;
};

const TIME_1MIN = 60000;

function MessageCpt(): ReactElement | null {
  const [password, setPassword] = useState<string | null>(
    window.localStorage.getItem("calendarsaurus:password")
  );
  const [encrypted, setEncrypted] = useState<string>();
  const [today, setToday] = useState(dayjs());

  useEffect(() => {
    function doRequest() {
      try {
        setToday(dayjs());
        httpGet<string>("messages-encrypted.txt").then(setEncrypted);
      } catch (e) {
        alert(e);
      }
    }

    doRequest();

    const id = setInterval(doRequest, TIME_1MIN);
    return () => clearInterval(id);
  }, []);

  if (!encrypted) return null;

  const passwordInput = (
    <input
      onChange={(e) => {
        setPassword(e.target.value);
      }}
    />
  );

  if (!password) {
    return passwordInput;
  }

  let message;
  try {
    const bytes = AES.decrypt(encrypted, password);
    const messages = JSON.parse(bytes.toString(enc.Utf8)).data as Message[]; // JSON standard allows the toplevel to be only objects

    window.localStorage.setItem("calendarsaurus:password", password);

    message = messages.find((m) => m.date === today.format("YYYY-MM-DD"));
  } catch (e) {
    console.error("wrong password");
    return passwordInput;
  }

  return (
    <>
      {message ? <div className={"today-info"}>{message.message}</div> : null}
      <small className={"debug-info"}>
        Gerendert um {dayjs().format("HH:mm:ss")}
      </small>
    </>
  );
}

export default App;
