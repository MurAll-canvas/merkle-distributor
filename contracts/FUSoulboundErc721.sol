// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.17;

import {MerkleDistributor} from "./MerkleDistributor.sol";
import {SoulboundErc721} from "./SoulboundErc721.sol";
import {FUImageUtils} from "./FUImageUtils.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract FUSoulboundErc721 is SoulboundErc721, Ownable {
    using SafeERC20 for IERC20;
    using Strings for uint256;
    struct FUData {
        uint256 animationDurationSeconds;
        string message;
    }
    address[] public hackerAddresses = [
        0xEe2e4fBe10A437e1B1561687D4e5133dd397AB96,
        0xfA715532c453163BDc8611C15D196b2527E689B2
    ];

    mapping(uint256 => FUData) private _tokenData;

    constructor(string memory name, string memory symbol) SoulboundErc721(name, symbol) {}

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mint(string memory message, uint256 animationDurationSeconds) external {
        uint256 tokenId = totalSupply();

        //pick a random hacker address
        address hackerAddress = hackerAddresses[tokenId % hackerAddresses.length];

        _tokenData[tokenId] = FUData(animationDurationSeconds, message);
        _mint(hackerAddress, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                "{",
                                '"name":"',
                                "MurAll never forgets",
                                '", "description":"',
                                _tokenData[tokenId].message,
                                '", "image_data": "',
                                FUImageUtils.generateBase64SVG(
                                    _tokenData[tokenId].animationDurationSeconds,
                                    _tokenData[tokenId].message
                                ),
                                '", "animation_url": "',
                                FUImageUtils.generateBase64Html(
                                    _tokenData[tokenId].animationDurationSeconds,
                                    _tokenData[tokenId].message
                                ),
                                '", "attributes": ',
                                generateAttributes(tokenId.toString()),
                                "}"
                            )
                        )
                    )
                )
            );
    }

    function generateAttributes(string memory tokenId) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "[",
                    '{"trait_type": "Token ID", "value": "',
                    tokenId,
                    '"}'
                    "]"
                )
            );
    }
}
