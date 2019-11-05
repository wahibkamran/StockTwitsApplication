import React, {Component} from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import './Stocks.css';
import axios from 'axios';

export default class Customers extends Component {

  constructor(props) {
    super(props)
    this.state = {symbol: '', symbolList: [], resultList: [], allSymbols: []};

    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
  }

  getTweetData(arr) {

    let resultList=[];
    let allSymbols=[];

    for(let i=0;i<arr.length;i++){
      axios.get('https://cors-anywhere.herokuapp.com/https://api.stocktwits.com/api/2/streams/symbol/'+arr[i]+'.json').then((response) => {
        let finalElem=this.createElements(response.data.messages, arr[i]);
        resultList.push(finalElem[0]);
        allSymbols.push(finalElem[1]);
        
        this.setState({
          resultList: resultList, 
          allSymbols: allSymbols
        });
      
      });
    }
  }

  createElements(data, symbol){

    let resultList=[];
    let allSymbols=[];

    allSymbols.push(
      <div>
      <button type="button" class="btn btn-secondary" key="deleteButton" onClick={this.handleDelete.bind(this, symbol)}> {symbol+' (Total tweets: '+data.length+')'}</button></div>

      );

    let tempList=data.map((tweet) =>
      {
        return(

          <div>
          <div className="customerdetails">
          {
            <Panel bsStyle="info" key={tweet.id} className="centeralign">
                <Panel.Heading>
                  <Panel.Title componentClass="h3">{tweet.user.name}</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <p>{tweet.body}</p>
                  <p>{tweet.created_at}</p>
                </Panel.Body>
                </Panel>
            }
            </div>
            </div>
            
          );
      });
    resultList=[...tempList, ...resultList];

    return [resultList, allSymbols];

  }

  handleChange(event){
    this.setState({
      symbol: event.target.value.toUpperCase()
    });
  }

  handleSubmit(event){
    event.preventDefault();

    let symbolList = this.state.symbol.replace(/ /g,'').split(',');

    this.getTweetData(symbolList);

    this.setState({
      symbol: '',
      symbolList: symbolList,
    });
  }


  handleDelete(item){
    let newSymbol=[];
    for(let i=0;i<this.state.symbolList.length;i++){
      if(this.state.symbolList[i]!==item){
        newSymbol.push(this.state.symbolList[i]);
      }
    }

    if(newSymbol.length===0){
      this.setState({symbol: '', symbolList: [], resultList: [], allSymbols: []});
    }else{
      this.setState({symbolList:newSymbol});
      this.getTweetData(newSymbol);
    }
  }

  render() {
    return (
    
      <div>
      <form id="symbolForm" onSubmit={this.handleSubmit}>
      <div className="form-group"> 
      <label>Type in the symbol: </label>
      <div class="form-group mx-sm-3 mb-2">
      <input type="text" className="form-control" value={this.state.symbol} onChange={this.handleChange}/>
      </div>
      </div>
      <div className="form-group">
          <input type="submit" value="Search!" className="btn btn-primary" />
      </div>
      </form>
      <div>{this.state.allSymbols}</div>
      <div>{this.state.resultList}</div>
    </div>
    )
    
  }
}