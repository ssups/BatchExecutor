// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.0;

contract BatchExcuter {
    function batchExcute(address ca, bytes[] calldata dataBytesArr, uint[] calldata valueArr) external {
        require(dataBytesArr.length == valueArr.length, "wrong arguments");
        for (uint i = 0; i < dataBytesArr.length; i++) {
            (bool sucess,) = ca.call{value: valueArr[i]}(dataBytesArr[i]);
            require(sucess, "failed excution");
        }
    }
}
