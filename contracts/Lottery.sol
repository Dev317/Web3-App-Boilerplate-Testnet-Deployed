pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    address public lastWinner;

    function Lottery() public {
        manager = msg.sender;
    }

    // payable means send eths
    function enter() public payable {
        // validation
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function generateRandom() private view returns (uint){
        return uint(keccak256(block.difficulty, now, players));
    }
                                  // function modifier
    function pickWinner() public restricted {
        uint index = generateRandom() % players.length;
        players[index].transfer(this.balance);
        lastWinner = players[index];
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address[]) {
        return players;
    }

    function getLastWinner() public view returns(address) {
        return lastWinner;
    }
}