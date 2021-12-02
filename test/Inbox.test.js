// import modules
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('../compile.js');

// create an instance of web3
// connecting to ganache via ganache.provider
const web3 = new Web3(ganache.provider());

/*
// testing class
class Car {
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

// global variable car 
let car;

// common initialization code for each test
beforeEach(() => {
    car = new Car();
})

describe('Car Class Test',() => {
    // passed test
    it('can park', () => {
        assert.equal(car.park(), 'stopped');
    });

    // failed test
    // it('can park', () => {
    //     assert.equal(car.park(), 'stopppped');
    // });

    // passed test
    it('can park', () => {
        assert.equal(car.drive(), 'vroom');
    });
});
*/

let accounts;
let inbox;
const INITIAL_MESSAGE = 'Hi there!';
const MODIFIED_MESSAGE = 'Bye there!';

beforeEach(async () => {
    // get a list of all accounts
    // web3.eth.getAccounts()
    //     .then(fetchedAccounts => {
    //         console.log(fetchedAccounts)
    //     });
    accounts = await web3.eth.getAccounts();

    // use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
                                  // constructor arguments
        .deploy({data: bytecode, arguments: [INITIAL_MESSAGE]})
          // use an account to actually deploy the contract and supply with eth
        .send({from : accounts[0], gas: '1000000'});

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        // console.log(inbox);

        // check if contract address is a defined value
        assert.ok(inbox.options.address);
    });

    it ('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(INITIAL_MESSAGE, message);
    });

    it ('modify message', async () => {
        // specifying who is paying to modify the contract
        await inbox.methods.setMessage(MODIFIED_MESSAGE).send({from : accounts[0]});
        const updateMessage = await inbox.methods.message().call();
        assert.equal(MODIFIED_MESSAGE, updateMessage);
    });
});