//using require for cross platform compatibility
const path = require("path");
const fs = require("fs");
const solc = require("solc");
//__dirname: path from root dir to proj dir
const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");

//to read contents
const source = fs.readFileSync(inboxPath, "utf8");

// module.exports = solc.compile(source, 1);

// console.log(solc.compile(source, 1));

module.exports = solc.compile(source, 1).contracts[":Inbox"];
