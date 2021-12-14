import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Color from "../abis/Color.json";
import { ReactComponent as Logo } from "./av2.svg";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: "",
            contract: null,
            totalSupply: 0,
            Heros: [],
            button: 0
        };
    }

    /**► Called on server side, as soon as component mounts */
    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    /**▶ Checking for Metamask Installation for login */
    async loadWeb3() {
        //new way
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        //the old way
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        //not found
        else {
            window.alert("Non-Ethereum browser derected. You should consider trying MetaMask!");
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });

        const networkId = await web3.eth.net.getId();
        const networkData = Color.networks[networkId];
        if (networkData) {
            const abi = Color.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address);
            this.setState({ contract });
            const totalSupply = await contract.methods.totalSupply().call();

            //load colors
            let count = 0;
            for (var i = 0; i < totalSupply; i++) {
                const hero = await contract.methods.allHero(i).call();
                if (this.state.account === hero.owner) count++;
                this.setState({
                    Heros: [...this.state.Heros, hero]
                });
            }
            this.setState({ totalSupply: count });
        } else {
            window.alert("Smart contract not deployed to detected network.");
        }
    }
    async mint(color) {
        console.log("minting:", color);

        await this.state.contract.methods.mint(color).send({ from: this.state.account });

        const last_idx = (await this.state.contract.methods.totalSupply().call()) - 1;
        const hero = await this.state.contract.methods.allHero(last_idx).call();
        this.setState({ Heros: [...this.state.Heros, hero] });
    }
    countMint = () => {
        let counter = 0;
        for (var i = 0; i < this.state.Heros.length; i++) {
            if (this.state.Heros[i].owner === this.state.account) counter++;
        }
        if (counter < 30) return true;
        else {
            alert("You have exhausted max limit of Minting. (Limit = 30)");
            return false;
        }
    };
    async sellNFT(index) {
        if (index === undefined || index < 0 || index > this.state.totalSupply) {
            alert("Enter a valid index. Index out of range.");
            return;
        }

        for (var i = 0; i < this.state.Heros.length; i++) {
            if (this.state.Heros[i].owner === this.state.account) {
                index -= 1;
                if (index < 0) {
                    console.log(this.state.Heros[i].color);
                    // await this.state.contract.methods.mint(color).send({ from: this.state.account });
                    const color = await this.state.Heros[i].color;
                    await this.state.contract.mehtods.sellNFT(color).sell({ from: this.state.account });
                    this.state.Heros.splice(index, i);
                    return;
                }
            }
        }
        alert("Enter a valid index. Index out of range.");
    }
    async fight(index) {
        if (index === undefined || index < 0) return;
        let myHero;
        for (var i = 0; i < this.state.Heros.length; i++) {
            if (this.state.Heros[i].owner === this.state.account) {
                index -= 1;
                if (index < 0) {
                    myHero = this.state.Heros[i];
                    break;
                }
            }
        }
        if (index > 0 || myHero === undefined) {
            alert("Enter a valid index. Index out of range.");
            return;
        }

        const op_health = Math.floor(Math.random() * 101);
        const op_attack = Math.floor(Math.random() * 101);
        const op_defence = Math.floor(Math.random() * 101);
        let color = this.state.Heros[0];
        let colorExists = true;
        while (colorExists) {
            color = "#" + Math.floor(Math.random() * 16777215).toString(16);
            colorExists = false;
            for (i = 0; i < this.state.Heros.length; i++)
                if (this.state.Heros[i].color === color) {
                    colorExists = true;
                    break;
                }
        }

        const myScore = +myHero.health + +myHero.defence - op_attack;
        const op_score = op_health + op_defence - +myHero.attack;
        console.log("My Hero", +myHero.health, +myHero.attack, +myHero.defence, myScore, myHero.color);
        console.log("Opponent Hero", op_health, op_attack, op_defence, op_score, color);
        if (myScore > op_score) {
            console.log("You win!, The token is now yours.");
            alert(`Your score: ${myScore}\nOpponent score: ${op_score}\nYou win!, The token is now yours.\nConfirm the metamask transaction.`);
            this.mint(color);
        } else {
            console.log("You Loose. Better Luck next time.");
            alert(`Your score: ${myScore}\nOpponent score: ${op_score}\nYou Loose. Better Luck next time.`);
        }
    }

    render() {
        if (this.state.account) {
            return (
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#/" target="_self" rel="noopener noreferrer">
                            Crypto Bots
                        </a>
                        <ul className="navbar-nav px-3">
                            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                                <small className="text-white">
                                    <span id="account">Account: {this.state.account}</span>
                                </small>
                            </li>
                        </ul>
                    </nav>

                    <div className="container-fluid mt-5">
                        <div className="row">
                            <main role="main" className="col-lg-12 d-flex text-center">
                                <div className="content mr-auto ml-auto">
                                    <h1>Issue Hero Token</h1>
                                    <form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            let color = this.state.Heros[0];
                                            let colorExists = true;
                                            while (colorExists) {
                                                color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                                                colorExists = false;
                                                for (var i = 0; i < this.state.Heros.length; i++)
                                                    if (this.state.Heros[i].color === color) {
                                                        colorExists = true;
                                                        break;
                                                    }
                                            }
                                            if (this.countMint()) this.mint(color);
                                            // window.location.reload();
                                        }}
                                    >
                                        <input type="submit" className="btn btn-block btn-primary" value={"MINT  (" + this.state.totalSupply + " / 30)"} />
                                    </form>
                                </div>
                            </main>
                        </div>
                        <hr />
                        <div className="row text-center">
                            {this.state.Heros.map((hero, key) => {
                                if (hero.owner === this.state.account) {
                                    return (
                                        <div key={key} className="col-md-3 mb-3">
                                            <div className="a">
                                                <div className="token">
                                                    <Logo fill={hero.color} stroke="black" strokeWidth="2px" width="50%" height="50%" />
                                                </div>
                                                <div className="heroHex">
                                                    {hero.color}
                                                    <div className="b">
                                                        <h6>Health: {+hero.health}</h6>
                                                        <h6>Attack: {+hero.attack}</h6>
                                                        <h6>Defence: {+hero.defence}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>

                    <div>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                const index = this.index.value;
                                if (this.state.button === 0) this.fight(index);
                                else this.sellNFT(index);
                            }}
                        >
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Enter index to select the token. (Default = 0)"
                                ref={(input) => {
                                    this.index = input;
                                }}
                            />
                            <div className="button-container">
                                <button onClick={() => (this.state.button = 0)} type="submit" name="btn1" value="fight" className="btn-9 buttons">
                                    FIGHT
                                </button>
                                <button onClick={() => (this.state.button = 1)} type="submit" name="btn2" value="sell" className="btn-10 butons">
                                    SELL
                                </button>
                            </div>
                        </form>
                    </div>
                    <input className="btn btn-block btn-primary footer" value="Ⓒ Copyright Arnav Gupta, Ritik Vatsal, Shrey Marwaha. All rights reserved." />
                </div>
            );
        } else {
            return <div className="error">Login & verify your Metamask account.</div>;
        }
    }
}

export default App;
