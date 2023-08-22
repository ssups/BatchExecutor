// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

error ExcutionFailed1(uint index, bytes data);
error ExcutionFailed2(address to, uint index, bytes data);

contract BatchExecutor {
    function batchExecutor1(address ca,
        bytes[] calldata dataBytesList,
        uint[] calldata valueList
    ) external {
        require(dataBytesList.length == valueList.length, "BatchExcturerwrong arguments");
        uint len = dataBytesList.length;
        for (uint i = 0; i < len;) {
            (bool sucess, bytes memory data) = ca.call{value: valueList[i]}(dataBytesList[i]);
            if(!sucess) revert ExcutionFailed1(i, data);
            unchecked{
                i++;
            }
        }
    }

    function batchExecutor2(
        address[] calldata caList,
        bytes[] calldata dataBytesList,
        uint[] calldata valueList
    ) external {
        require(
            (caList.length == dataBytesList.length) &&
            (dataBytesList.length == valueList.length),
            "wrong arguments"
        );
        uint len = dataBytesList.length;
        for (uint i = 0; i < len;) {
            (bool sucess, bytes memory data) = caList[i].call{value: valueList[i]}(dataBytesList[i]);
            if(!sucess) revert ExcutionFailed2(caList[i], i, data);
            unchecked{
                i++;
            }
        }
    }
}
