// import modules
const path = require('path');
const fs = require('fs');
const solc = require('solc');

// find the path of Inbox.sol
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');

// read source code
const source = fs.readFileSync(inboxPath, 'utf8');

console.log(solc.compile(source, 1));

// solc compliing code                             Destructuring compiled code
module.exports = solc.compile(source, 1).contracts[':Inbox'];