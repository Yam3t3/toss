// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Toss is Ownable {
    event Result(uint256 r, string message);
    event TokenTransferred(IERC20 token, address to, uint256 amount);

    IERC20 private DATtoken;
    address private DATAddress;
    uint256 private value;
    uint256 private win_value;
    uint256 private token_value;
    mapping(address => uint256) private balances;

    receive() external payable {}

    constructor() {
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
        require(balances[msg.sender] <= DATtoken.balanceOf(address(this)), "Insufficient token balance");
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;
        DATtoken.transfer(msg.sender, amount);
        emit TokenTransferred(DATtoken, msg.sender, amount);   
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
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

    function getDATaddress() public view returns (address)  { 
        return DATAddress; 
    } 
    function setDATaddress(address new_DAT_address) public onlyOwner { 
        DATAddress = new_DAT_address;
        DATtoken = IERC20(new_DAT_address);
    } 
}