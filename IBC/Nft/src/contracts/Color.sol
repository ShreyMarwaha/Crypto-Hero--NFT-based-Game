pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
import "./ERC721Full.sol";

contract Color is ERC721Full {
    struct Hero {
        string color;
        address owner;
        uint256 health;
        uint256 attack;
        uint256 defence;
    }
    Hero[] public allHero;
    address market = parseAddr("0x0918cC2648601bF82A415346e1CAc1c06C7Ca7FC");
    mapping(string => bool) colorExists;

    constructor() public ERC721Full("Color", "COLOR") {}

    uint256 randNonce = 0;

    /**Returns a random number */
    function random(uint256 _modulus) internal returns (uint256) {
        randNonce++;
        return uint256(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
    }

    /**Minting the new Hero */
    function mint(string memory color) public {
        // require unique color
        require(!colorExists[color]); //if color exits, trigger exception
        Hero memory newHero = Hero(color, msg.sender, random(100), random(100), random(100));
        mintUtil(newHero);
        colorExists[color] = true;
    }

    function mint(
        string memory color,
        uint256 h,
        uint256 a,
        uint256 d
    ) public {
        // require unique color
        require(!colorExists[color]); //if color exits, trigger exception
        Hero memory newHero = Hero(color, msg.sender, h, a, d);
        mintUtil(newHero);
        colorExists[color] = true;
    }

    function mintUtil(Hero memory newHero) public {
        uint256 id = allHero.push(newHero); //returns length
        _mint(msg.sender, id);
    }

    function compareStrings(string memory s1, string memory s2) public pure returns (bool) {
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }

    function sellNFT(string memory color) public {
        for (uint256 i = 0; i < allHero.length; i++) {
            if (compareStrings(allHero[i].color, color)) {
                delete allHero[i];
                return;
            }
        }
    }

    function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint256 i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }
}

/**
 1. To create new blockchain
 sudo truffle migrate --reset

 2. Open truffle console
 truffle console

 3. Create contract
 contract = await Color.deployed()

 4. Call any methods
 e.g. contract.colors(0)
 contract.mint("#123890)

  */

/**
  TODO
  9. Fight logic: get nft on win
  10. Limit 30 on mint
  11. sell nft
   */

/**
   BUGS
2. adding token of anything gets added to chain: make a checker for only valid hex color
    */
