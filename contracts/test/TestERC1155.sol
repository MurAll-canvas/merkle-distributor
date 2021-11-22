// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.6.11;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract TestERC1155 is ERC1155 {
    constructor (string memory uri) ERC1155(uri) public {}
}
