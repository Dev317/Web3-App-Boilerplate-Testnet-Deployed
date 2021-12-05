// import modules
const path = require('path');
const fs = require('fs');
const solc = require('solc');

// find the path of Inbox.sol
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

// read source code
const source = fs.readFileSync(lotteryPath, 'utf8');

// solc compliing code                             Destructuring compiled code
module.exports = solc.compile(source, 1).contracts[':Lottery'];
console.log(solc.compile(source, 1).contracts[':Lottery'])