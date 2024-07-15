pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DevToken is ERC20 {
    constructor() ERC20("devtoken", "DT") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}

