import React, { Component } from 'react';
import SushiContainer from './containers/SushiContainer';
import Table from './containers/Table';

// Endpoint!
const API = "http://localhost:3000/sushis"

class App extends Component {
  constructor() {
    super();
    this.state = {
      sushi: [],
      balance: 500,
      sushiPointer: 4,
      displayedSushi: [],
    }
  }

  componentDidMount() {
    fetch(API).then(resp => resp.json())
    .then(sushi => sushi.map(this.addSushiData))
    .then(sushi => this.setState({
      sushi: sushi,
      displayedSushi: sushi.slice(0, 4),
    }));
  }

  render() {
    return (
      <div className="app">
        <SushiContainer sushi={this.state.displayedSushi} eat={this.eatSushi} more={this.getMoreSushi} />
        <Table balance={this.state.balance} plates={this.state.sushi.filter(this.eatenFilter) } />
      </div>
    );
  }

  eatenFilter = sushi => sushi.eaten;
  uneatenFilter = sushi => !sushi.eaten;

  getMoreSushi = () => {
    let uneatenCount = this.state.sushi.filter(this.uneatenFilter).length;
    let newSP = this.state.sushiPointer;
    let newSushi = [];

    for (let i = newSP; newSushi.length < uneatenCount && newSushi.length < 4; i = this.safeIncrement(i) ) {
      if (!this.state.sushi[i].eaten) {
        newSP = this.safeIncrement(i);
        newSushi.push(this.state.sushi[i]);
      }
    }
    this.setState({
      sushiPointer: newSP,
      displayedSushi: newSushi,
    })
  }

  safeIncrement = (i) => ++i % this.state.sushi.length;

  addSushiData = (sushi, index) => {
    sushi.eaten = false;
    sushi.index = index;
    return sushi;
  }

  eatSushi = i => {
    if(!this.state.sushi[i].eaten && this.state.sushi[i].price <= this.state.balance) {
      this.setState({
        sushi: this.state.sushi.map(sushi => {
          if(sushi.index === i) {
            sushi.eaten = true;
          }
          return sushi;
        }),
        balance: this.state.balance - this.state.sushi[i].price,
      })
    }
  }
}

export default App;