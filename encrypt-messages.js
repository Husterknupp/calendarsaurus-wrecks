const CryptoJS = require("crypto-js");
const fs = require("fs");

let outDir = "public/messages-encrypted.txt";
console.log("Encrypting messages. Find output here: ", outDir);

if (!process.env.PASSWORD) {
  throw Error(
    "Missing password. Provide as first argument.\nLike this: `PASSWORD=<your_pw> npm run deploy"
  );
}
const messages = fs.readFileSync("messages.json", { encoding: "utf-8" });
const ciphertext = CryptoJS.AES.encrypt(
  messages,
  process.env.PASSWORD
).toString();

fs.writeFileSync(outDir, ciphertext, {
  encoding: "utf-8",
});
