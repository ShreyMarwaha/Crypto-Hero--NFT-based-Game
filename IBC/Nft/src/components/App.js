import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Color from "../abis/Color.json";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: "",
            contract: null,
            totalSupply: 0,
            Heros: []
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
            window.alert(
                "Non-Ethereum browser derected. You should consider trying MetaMask!"
            );
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
            this.setState(totalSupply);
            //load colors
            for (var i = 0; i < totalSupply; i++) {
                const hero = await contract.methods.allHero(i).call();
                console.log(
                    hero.color,
                    hero.owner,
                    hero.attack,
                    hero.defence,
                    hero.health
                );
                // const ownerAddr = await contract.methods.owner(i).call();
                // console.log("from:", ownerAddr);
                this.setState({
                    Heros: [...this.state.Heros, hero]
                });
            }
        } else {
            window.alert("Smart contract not deployed to detected network.");
        }
    }
    async mint(color) {
        console.log(color);
        this.state.contract.methods
            .mint(color)
            .send({ from: this.state.account });

        const last_idx =
            (await this.state.contract.methods.totalSupply().call()) - 1;
        const hero = await this.state.contract.methods.allHero(last_idx).call();
        this.setState({ Heros: [...this.state.Heros, hero] });
    }
    async fight(e) {
        e.preventDefault();
        const hero = await this.state.contract.methods.allHero(0).call();
        console.log("in fight");
        // console.log(await this.state.contract.methods.allHero(0).call());
        // const my = Math.random(this.state.Heros.length);
        // const other = Math.random(this.state.Heros.length);
        // my = this.state.Heros[my];
        // other = this.state.Heros[other];
        // console.log(my.color, my.health);
        // console.log(other.color, other.health);
    }

    render() {
        if (this.state.account) {
            return (
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                        <a
                            className="navbar-brand col-sm-3 col-md-2 mr-0"
                            href="http://www.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            An AF Tea
                        </a>
                        <ul className="navbar-nav px-3">
                            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                                <small className="text-white">
                                    <span id="account">
                                        Account: {this.state.account}
                                    </span>
                                </small>
                            </li>
                        </ul>
                    </nav>

                    <div className="container-fluid mt-5">
                        <div className="row">
                            <main
                                role="main"
                                className="col-lg-12 d-flex text-center"
                            >
                                <div className="content mr-auto ml-auto">
                                    <h1>Issue Hero Token</h1>
                                    <form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            const color = this.color.value;
                                            this.mint(color);
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="fomr-control mb-1"
                                            placeholder="eg. #FFFFFF"
                                            ref={(input) =>
                                                (this.color = input)
                                            }
                                        />
                                        <input
                                            type="submit"
                                            className="btn btn-block btn-primary"
                                            value="MINT"
                                        />
                                    </form>
                                </div>
                            </main>
                        </div>
                        <hr />
                        <div className="row text-center">
                            {this.state.Heros.map((hero, key) => {
                                return (
                                    <div key={key} className="col-md-3 mb-3">
                                        <div
                                            className="token"
                                            style={{
                                                backgroundColor: hero.color
                                            }}
                                        ></div>
                                        <div>{hero.color}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <button
                            className="btn btn-block btn-primary"
                            onClick={this.fight}
                        >
                            Fight!
                        </button>
                    </div>
                </div>
            );
        } else {
            return <div>Login & verify your Metamask account.</div>;
        }
    }
}

export default App;
