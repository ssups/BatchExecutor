// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.0;

contract Counter {
    uint public count;
    mapping (address => uint) public userCount;

    function addCount1() external {
        count ++;
    }

    function addCount2(uint count_) external {
        count += count_;
    }

    function addCount3(address user_, uint count_) external {
        userCount[user_] = count_;
    }
}