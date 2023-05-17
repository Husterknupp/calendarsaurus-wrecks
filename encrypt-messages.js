const CryptoJS = require("crypto-js");
const fs = require("fs");

let outDir = "public/messages-encrypted.txt";
console.log("Encrypting messages. Find output here: ", outDir);

if (!process.argv[2]) {
  throw Error(
    "Missing password. Provide as first argument.\nnpm run build -- <your_pw>"
  );
}
const messages = fs.readFileSync("messages.json", { encoding: "utf-8" });
const ciphertext = CryptoJS.AES.encrypt(messages, process.argv[2]).toString();

fs.writeFileSync(outDir, ciphertext, {
  encoding: "utf-8",
});
