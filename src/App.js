import React, { Component } from 'react';
import logo from './logo.jpg';
import './App.css';
import Stocks from './Stocks'
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';




class App extends Component {
  render() {
    return (

      <Router basename={process.env.PUBLIC_URL}>
        <div class="App">
        <header class="App-header">
          <img src={logo} class="App-logo" alt="logo" />
          <h1 class="App-title">Stock Fetcher: StockTwits Search</h1>
        </header>
          <Switch>
                <Route exact path= "/" render={() => (
                  <Redirect to="/searchtweets"/>
                )}/>
                 <Route exact path='/searchtweets' component={Stocks} />
          </Switch>
      </div>
    </Router>

    );
  }
}

export default App;
