import React, { ReactElement, useEffect, useState } from "react";
import "./App.css";
import dayjs from "dayjs";
import LOCALE_DE from "dayjs/locale/de";
import axios from "axios";
import CryptoJS from "crypto-js";

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

type Message = {
  date: string; // 2023-05-11
  message: string;
};

async function getMessages(): Promise<Message[]> {
  const encrypted = await axios.get("messages-encrypted.txt");
  // todo password to be entered instead
  const bytes = CryptoJS.AES.decrypt(encrypted.data, "secret key 123");
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)).data; // JSON standard allows the toplevel to be only objects
}

const TIME_1MIN = 60000;

function MessageCpt(): ReactElement | null {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    async function doRequest() {
      // js: `<script defer="defer" src="/calendarsaurus-wrecks/static/js/main.39124231.js">`
      // %PUBLIC_URL% -> /calendarsaurus-wrecks
      setMessages(await getMessages());
    }

    doRequest();

    const id = setInterval(doRequest, TIME_1MIN);
    return () => clearInterval(id);
  }, []);

  const today = dayjs().format("YYYY-MM-DD");
  const message = messages.find((m) => m.date === today);

  return message ? <div className={"today-info"}>{message.message}</div> : null;
}

export default App;
