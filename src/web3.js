import Web3 from 'web3';
// import detectEthereumProvider from '@metamask/detect-provider';

// const provider = async () => { await detectEthereumProvider() };
// const web3 = new Web3(provider);
let web3;

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.enable();
} else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
} else {
    window.alert('Non-Ethereum browser detected. Please install MetaMask plugin');
};

export default web3;