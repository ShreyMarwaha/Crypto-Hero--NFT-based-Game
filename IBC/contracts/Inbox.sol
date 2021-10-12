pragma solidity ^0.4.17;
contract MyContract{
    string public message;
    function MyContract(string initialMessage) public {
        message = initialMessage;
    }
    function setMessage(string newMessage) public{
        message = newMessage;
    }
}