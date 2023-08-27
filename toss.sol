// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Toss {
    event Result(uint256 r, string message);

    receive() external payable {}

    function play() public payable {
        require(msg.value == 0.001 ether, "Wrong value");
        uint balance = address(this).balance;
        require(0.0015 ether < balance, "Not enough found left !");
        
        uint256 randomNumber = block.prevrandao; // block.difficulty
        if (randomNumber % 2 == 0) {
        (bool success, ) = msg.sender.call{value: 0.00145 ether}("");
        require(success, "Transfer failed.");
        emit Result(randomNumber, "You won !");
        }
        else emit Result(randomNumber, "No luck this time");
    }

    function withdraw() external {
    uint balance = address(this).balance;
    payable(0x5bB73e04b810527B14b87c37EFf3d62481f2D416).transfer(balance);
    }

}