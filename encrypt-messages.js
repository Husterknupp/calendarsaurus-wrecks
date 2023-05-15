const CryptoJS = require("crypto-js");
const fs = require("fs");

let outDir = "public/messages-encrypted.txt";
console.log("Encrypting messages. Find output here: ", outDir);

const messages = fs.readFileSync("messages.json", { encoding: "utf-8" });
// todo password to be entered instead
const ciphertext = CryptoJS.AES.encrypt(messages, "secret key 123").toString();

fs.writeFileSync(outDir, ciphertext, {
  encoding: "utf-8",
});
