// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

error ExcutionFailed(address to, uint index);

contract BatchExcuter {
    function batchExcute1(address ca,
        bytes[] calldata dataBytesList,
        uint[] calldata valueList
    ) external {
        require(dataBytesList.length == valueList.length, "wrong arguments");
        for (uint i = 0; i < dataBytesList.length; i++) {
            (bool sucess, ) = ca.call{value: valueList[i]}(dataBytesList[i]);
            if(!sucess) revert ExcutionFailed(ca, i);
        }
    }

    function batchExcute2(
        address[] calldata caList,
        bytes[] calldata dataBytesList,
        uint[] calldata valueList
    ) external {
        require(
            (caList.length == dataBytesList.length) &&
            (dataBytesList.length == valueList.length),
            "wrong arguments"
        );
        for (uint i = 0; i < dataBytesList.length; i++) {
            (bool sucess, ) = caList[i].call{value: valueList[i]}(dataBytesList[i]);
            if(!sucess) revert ExcutionFailed(caList[i], i);
        }
    }
}
