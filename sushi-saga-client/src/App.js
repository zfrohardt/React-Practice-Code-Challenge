import React, { Component } from 'react';
import SushiContainer from './containers/SushiContainer';
import Table from './containers/Table';

// Endpoint!
const API = "http://localhost:3000/sushis"

export default class App extends Component {
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
        <Table balance={this.state.balance} plates={this.state.sushi.filter(sushi => sushi.eaten) } />
      </div>
    );
  }

  // returns the next n uneaten bits of sushi from the queue
  getMoreSushi = (n = 4) => {
    let uneatenCount = this.state.sushi.filter(sushi => !sushi.eaten).length;
    let newSP = this.state.sushiPointer;
    let newSushi = [];

    for (let i = newSP; newSushi.length < uneatenCount && newSushi.length < n; i = this.safeIncrement(i) ) {
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

  // safely increments an index around the sushi queue array
  safeIncrement = (i) => ++i % this.state.sushi.length;

  // initializes a sushi object with additional information for the gloabl queue
  addSushiData = (sushi, index) => {
    sushi.eaten = false;
    sushi.index = index;
    return sushi;
  }

  // consume a sushi at a given index
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