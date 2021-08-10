import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
import logo from "./logo.png";
import "./index.css";



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
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
       await this.setState({players, balance});
    };


    onClick = async (event) =>{
      event.preventDefault();

      const accounts  = await web3.eth.getAccounts();
    
      this.setState({message:"Waiting on transaction success..."});
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      const winner = await lottery.methods.lastWinner().call();
      this.setState({message: winner + ' won!'});
    };

  render() {
    return (

      <center><div><br></br>
      <div><img src={logo} alt="Logo" /></div>
        <h2 className = "fontMelon">Melon's Lottery</h2>
        

          <p className = "fontPrizePool">There are currently<b>{" "}
          {this.state.players.length}</b> people entered, competing to win<b>{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} BNB!</b>
        </p>

        <form onSubmit={this.onSubmit}>
          <div>
            <label className = "amountOf">Amount of BNB to enter (Min: 0.005 / Max: 0.01) </label>
            <p><input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            /></p>
          </div>
          <p><button className="buttonEnter">Enter</button></p>
        </form>


        <button className="buttonStart" onClick={this.onClick}>Pick a winner! (Manager Only)</button>
        
        <h1 className = "fontNotification">{this.state.message}</h1>
        <p className = "fontSubtitle">
          This contract is managed by Melon Team. </p>

      </div>
      
          <p className = "fontFooterLinks">
          Links: <a href = "https://melontokenbsc.com/">Website</a> | <a href = "https://twitter.com/melontokenbsc">Twitter</a> | <a href = "https://t.me/melonbsc"> Telegram</a></p>
      </center>
    );
  }
}
export default App;
