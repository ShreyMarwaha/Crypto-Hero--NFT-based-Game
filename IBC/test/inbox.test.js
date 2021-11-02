const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3"); //constructor, for creating instances of web3
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");
/*** HOW TO TEST : npm run test */

/* class Car {
	park() {
		return "stopped";
	}
	drive() {
		return "vroom";
	}
}
describe("Car", () => {
	const car = new Car();

	it("can park", () => {
		assert.equal(car.park(), "stopped");
	});
	it("can drive", () => {
		assert.equal(car.drive(), "vroom");
	});
});
*/
let accounts, inbox;
beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();

	//Use one of rthose account to deploy the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface)).deploy({ data: bytecode, arguments: ["Hi There!"] }).send({ from: accounts[0], gas: "1000000" });
});
describe("Inbox", () => {
	it("deploys a contract", () => {
		console.log(inbox);
	});
});
