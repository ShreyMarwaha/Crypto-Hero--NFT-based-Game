const { assertScopable } = require("@babel/types");
const { assert } = require("chai");

//artifact is abi/color.json
const Color = artifacts.require("./Color.sol");

require("chai")
    .use(require("chai-as-promised"))
    .should();

contract("Color", (accounts) => {
    let contract;
    before(async () => {
        //getting a deployed copy of smart contract from the blockchain
        contract = await Color.deployed(); //returns a promise
    });

    describe("*Deployment", async () => {
        it("deplpys successfully", async () => {
            const address = contract.address;
            console.log(address);
            assert.notEqual(address, "");
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("has a name", async () => {
            const name = await contract.name();
            assert.equal(name, "Color");
        });

        it("has a symbol", async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, "COLOR");
        });
    });

    describe("*Minting", async () => {
        it("creates a new token", async () => {
            const result = await contract.mint("#EC058E");
            const totalSupply = await contract.totalSupply(); //returns total numnber of tokens present

            //SUCCESS
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(
                event.tokenId.toNumber(),
                totalSupply,
                "id is correct"
            );
            assert.equal(
                event.from,
                "0x0000000000000000000000000000000000000000",
                "from is correct"
            );
            assert.equal(event.to, accounts[0], "to is correct");

            //FAILURE: cannont mint same color twice
            await contract.mint("#EC058E").should.be.rejected;
        });
    });

    describe("*Indexing", async () => {
        it("lists colors", async () => {
            //Mint 3 more tokens
            await contract.mint("#5386E4");
            await contract.mint("#FFFFFF");
            await contract.mint("#000000");

            const totalSupply = await contract.totalSupply();
            let color;
            let result = [];
            for (var i = 0; i < totalSupply; i++) {
                color = await contract.colors(i);
                result.push(color);
            }

            let expected = ["#EC058E", "#5386E4", "#FFFFFF", "#000000"];
            assert.equal(result.join(","), expected.join(","));
        });
    });
});
