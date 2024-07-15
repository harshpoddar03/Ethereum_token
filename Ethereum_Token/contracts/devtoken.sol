pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract DevToken is ERC20Capped , ERC20Burnable ,Pausable  {
    address payable public owner;
    uint256 public blockReward;

    constructor(uint256 cap,uint256 reward) ERC20("devtoken", "DT") ERC20Capped(cap * 10 ** decimals())  {
        owner = payable(msg.sender);
        _mint(owner, 70000000 * 10 ** decimals());
        blockReward = reward * 10 ** decimals();
    }

    function _mintMinerReward() public {
        _mint(block.coinbase, blockReward); // the _ mint function is from ERC20 so its a derived contract
    } // here coinbase is the address of the miner who mined the block

    function _update(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
        if (from == address(0) && to != block.coinbase && block.coinbase != address(0)) { // here address(0) is the address of the zero account ( no account )
            _mintMinerReward();
        }
        super._update(from, to, amount);
    
    }

    function setBlockReward(uint256 reward) public OnlyOwner {
        blockReward = reward * 10 ** decimals();
    }
   function pause() public OnlyOwner {
        _pause();
    }

    function unpause() public OnlyOwner {
        _unpause();
    }

    modifier OnlyOwner() {
        require(msg.sender == owner, "only owner can set block reward");
        _;
    }


}

