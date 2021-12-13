pragma solidity 0.5.0;
import "./ERC721Full.sol";
contract Color is ERC721Full{

    struct Hero{
        string color;
        address owner;
        uint health;
        uint attack;
        uint defence;
    }
    Hero[] public allHero;
    // string[] public colors;
    // address[] public owner;
    mapping(string => bool) colorExists;
    

    constructor() ERC721Full("Color", "COLOR") public{}

    /**Returns random uint */
    uint randNonce = 0;
 
    /**Returns a random number */
    function random(uint _modulus) internal returns(uint)
    {
        randNonce++; 
        return uint(keccak256(abi.encodePacked(now,msg.sender,randNonce))) % _modulus;
    }

    /**Minting the new Hero */
    function mint(string memory color) public{
        // require unique color
        require(!colorExists[color]); //if color exits, trigger exception

        Hero memory newHero = Hero(color, msg.sender, random(100), random(100), random(100), 0);
        uint id = allHero.push(newHero);//returns length
        // colors.push(color); 
        _mint(msg.sender, id); 
        colorExists[color] = true;

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

  */

  /**
  TODO
  1. health, defence, attack comes as BigNumber in console : convert to normal integer
  2. 
  3. Only show tokens owned by metamask owner
  4. a seperate page / on hover token show stats(attack, health, defence)
  5. fight page + on Navbar
  6. random hex generator
  7. hero pics instead of cicles
  8.

   */

   /**
   BUGS
1. while adding new token, new token is visible of prev color, but corrects after reloading.
2. adding token of anything gets added to chain: make a checker for only valid hex color
    */
