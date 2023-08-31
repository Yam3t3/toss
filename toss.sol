// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "DAT.sol";

contract Toss is Ownable {
    event Result(uint256 r, string message);
    event TokenTransferred(IERC20 token, address to, uint256 amount);

    IERC20 public DATtoken;
    uint256 value;
    uint256 win_value;
    uint256 token_value;
    mapping(address => uint256) balances;

    receive() external payable {}

    constructor() {
        DATtoken = new DAT();
        value = 0.001 ether;
        win_value = 0.00145 ether;
        token_value = 1 ether;
    }

    function play() public payable {
        require(msg.value == value, "Wrong value");
        uint balance = address(this).balance;
        require(win_value < balance, "Not enough found left !");
        
        uint256 randomNumber = block.prevrandao; // block.difficulty
        if (randomNumber % 2 == 0) {
        (bool success, ) = msg.sender.call{value: win_value}("");
        require(success, "Transfer failed.");
        emit Result(randomNumber, "You won !");
        }
        else emit Result(randomNumber, "No luck this time");
        balances[msg.sender] += token_value;
    }

   function getDATBalance(address add) public view returns(uint256) {
       return balances[add];
   }

   function withdrawDAT() public {
        require(DATtoken.balanceOf(msg.sender) <= DATtoken.balanceOf(address(this)), "Insufficient token balance");
        balances[msg.sender] = 0;
        DATtoken.transfer(msg.sender, balances[msg.sender]);
        emit TokenTransferred(DATtoken, msg.sender, balances[msg.sender]);   
    }

    function withdraw() external {
    uint balance = address(this).balance;
    payable(0x5bB73e04b810527B14b87c37EFf3d62481f2D416).transfer(balance);
    }

    function getValue() public view returns (uint) { 
        return value; 
    } 
    function setValue(uint new_value) public onlyOwner { 
        value = new_value; 
    } 

    function getWinValue() public view returns (uint)  { 
        return win_value; 
    } 
    function setWinValue(uint new_win_value) public onlyOwner { 
        win_value = new_win_value; 
    } 

    function getTokenValue() public view returns (uint)  { 
        return token_value; 
    } 
    function setTokenValue(uint new_token_value) public onlyOwner { 
        token_value = new_token_value; 
    } 
}