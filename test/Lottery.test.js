const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile.js');

const web3 = new Web3(ganache.provider());

let lottery;
let accounts;

beforeEach( async() => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data : bytecode})
    .send({ from : accounts[0], gas : '1000000'});
});

describe('Lottery Contract', () => {
    it('Deploy contract successfully', () => {
        assert.ok(lottery.options.address);
    });

    it('Allow an account to enter lottery', async () => {
        await lottery.methods.enter().send({
            from  : accounts[0],
            value : web3.utils.toWei('0.02', 'ether') 
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(players[0], accounts[0]);
        assert.equal(1, players.length);
    });

    it('Allow multiple accounts to enter lottery', async () => {
        await lottery.methods.enter().send({
            from  : accounts[0],
            value : web3.utils.toWei('0.02', 'ether') 
        });

        await lottery.methods.enter().send({
            from  : accounts[1],
            value : web3.utils.toWei('0.02', 'ether') 
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(players[0], accounts[0]);
        assert.equal(players[1], accounts[1]);

        assert.equal(2, players.length);
    });

    it('Requires a minium ammount of eth to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from : accounts[0],
                value : web3.utils.toWei('0.01', 'ether') 
            });

            // if the above code passed through, our test result will be rendered failed automatically
            assert(false);
        } catch (error) {
            // assert error exists
            assert(error);
        }
    });

    it('Only manager can call pickWinner()', async ()=> {
        try {
            await lottery.methods.pickWinner().send({
                from : accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        };
    });

    it ('End-to-end test', async() => {
        await lottery.methods.enter().send({
            from  : accounts[0],
            value : web3.utils.toWei('0.02', 'ether') 
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
                from : accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        // might cost gas to send transactions
        assert(difference <= web3.utils.toWei('2', 'ether'));

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert.equal(0, players.length);
    });
})