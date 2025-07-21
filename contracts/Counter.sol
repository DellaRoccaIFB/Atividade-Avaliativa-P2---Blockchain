// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Counter {
    uint256 public count;
    string public ownerName; 

    event Congratulations(address winner, uint256 count);

    constructor(string memory _initialName) {
        count = 0;
        ownerName = _initialName; 
        console.log("Contrato Counter implantado pelo proprietario:", ownerName);
    }

    function increment() public {
        count += 1;
        console.log("Contagem incrementada para:", count);

        if (count == 10) {
            emit Congratulations(msg.sender, count);
        }
    }

    function decrement() public {
        if (count > 0) {
            count -= 1;
            console.log("Contagem decrementada para:", count);
        }
    }

    function reset() public {
        count = 0;
        console.log("Contagem zerada.");
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}