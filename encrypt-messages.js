const CryptoJS = require("crypto-js");
const fs = require("fs");

const messages = fs.readFileSync("messages.json", { encoding: "utf-8" });
// todo password to be entered instead
const ciphertext = CryptoJS.AES.encrypt(messages, "secret key 123").toString();

console.log(`ciphertext`, ciphertext);

fs.writeFileSync("./public/messages-encrypted.txt", ciphertext, {
  encoding: "utf-8",
});
