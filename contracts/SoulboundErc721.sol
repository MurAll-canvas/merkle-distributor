// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.17;

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error SoulboundCannotBeTransferred(string message);

contract SoulboundErc721 is ERC721Enumerable {

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        if (from != address(0)) {
            revert SoulboundCannotBeTransferred("Soulbound cannot be transferred");
        }
        super._beforeTokenTransfer(from, to, tokenId);
    }
}