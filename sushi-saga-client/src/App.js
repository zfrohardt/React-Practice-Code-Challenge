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
      balance: 10000,
      sushiPointer: 0,
      showUneaten: false,
    }
  }

  componentDidMount() {
    fetch(API).then(resp => resp.json())
    .then(sushi => sushi.map(this.addSushiData))
    .then(sushi => this.setState({
      sushi: sushi,
    }));
  }

  render() {
    return (
      <div className="app">
        <SushiContainer sushi={this.getNextSushi()} eat={this.eatSushi} more={this.getMoreSushi} />
        <Table balance={this.state.balance} plates={this.state.sushi.filter(this.eatenFilter) } />
      </div>
    );
  }

  eatenFilter = sushi => sushi.eaten;
  uneatenFilter = sushi => !sushi.eaten;

  getMoreSushi = () => {
    this.setState({
      sushiPointer: this.safeAdd(this.state.sushiPointer, 4),
      showUneaten: false,
    })
  }

  getNextSushi = () => {
    if(this.state.showUneaten) {
      this.setState({
        showUneaten: true,
      })
    }
    
    let sp = this.state.sushiPointer;
    let uneatenSushi = this.state.sushi.filter(this.uneatenFilter);
    let returnedSushi = [];

    if (uneatenSushi.length < 4) {
      return uneatenSushi;
    } else {
      for (let i = sp; returnedSushi.length < 4; i = this.safeAdd(i)) {
        if (!this.state.sushi[i].eaten) {
          returnedSushi.push(this.state.sushi[i]);
        }
      }
    }

    return returnedSushi;
  }

  safeAdd = (i, n = 1) => {
    return (i + n) % this.state.sushi.length;
  }

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