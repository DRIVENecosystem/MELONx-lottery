import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
import logo from "./logo.png";
import "./App.css";



class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    lastWinner: ""
  
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const lastWinner = await lottery.methods.pickWinner().call();
  
   

    this.setState({ manager, players, balance, lastWinner});
  };


  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You are now in the game"});
    await this.updatePlayersBalance();
  };

  

  updatePlayersBalance = async () => {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
       await this.setState({manager, players, balance});
    };


    onClick = async (event) =>{
      event.preventDefault();

      const accounts  = await web3.eth.getAccounts();
    
      this.setState({message:"Waiting on transaction success..."});
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      const winner = await lottery.methods.lastWinner().call();
      this.setState({message: winner + ' won the last lottery game'});
    };

  render() {
    return (

      <center><div><br></br>
      <img src={logo} alt="Logo" />
        <h2>Melon's Lottery</h2>
        <p>
          This contract is managed by Melon Team ({this.state.manager}). </p><p>There are currently<b>{" "}
          {this.state.players.length}</b> people entered, competing to win<b>{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} BNB!</b>
        </p>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Try your luck and try to not lose your money!</h4>
          <div>
            <label>Amount of BNB to enter (Min: 0.005 / Max: 0.01) </label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <p><button>Enter</button></p>
        </form>


        <h4>Pick a winner (Manager Only)</h4>
        <button onClick={this.onClick}>Start</button>
        
        <h1>{this.state.message}</h1>
      </div>
      </center>
    );
  }
}
export default App;
