const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile.js');

const MNEMONIC_PHRASE = 'video monster benefit field trim jungle blossom nothing rose tooth refuse decorate';
const INFURA_API_KEY = 'https://rinkeby.infura.io/v3/2e5d5b3653fb4f408c5305b7b5490a42';

const provider = new HDWalletProvider(
  'video monster benefit field trim jungle blossom nothing rose tooth refuse decorate', 
  'https://rinkeby.infura.io/v3/2e5d5b3653fb4f408c5305b7b5490a42');
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 6500000, gasPrice: 100000000000 });

  console.log(interface);
  console.log('Contract deployed to', result.options.address);
};
deploy();
