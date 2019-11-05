import React, {Component} from 'react';
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import axios from 'axios'

export default class Customers extends Component {

  constructor(props) {
    super(props)
    this.state = {symbol: ''};

    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
  }

  componentDidMount(){
    this.createElements();
  }

  handleChange(event){
    event.preventDefault();
    this.setState({symbol: event.target.value.toUpperCase()});
  }

  handleSubmit(event){

    document.getElementById("symbolForm").reset();
    this.setState({symbolList: this.state.symbol.replace(/ /g,'').split(',')});
    let listtemp = this.getTweetData(this.state.symbol.replace(/ /g,'').split(','));
    this.setState({tweetList: listtemp});
    
    let finalElem = this.createElements();

    this.setState({resultList: finalElem[0], allSymbols: finalElem[1]});
    event.preventDefault();
  }

  handleDelete(item){
    let newSymbol=[];
    for(let i=0;i<this.state.symbolList.length;i++){
      if(this.state.symbolList[i]!==item){
        newSymbol.push(this.state.symbolList[i]);
      }
    }
    this.state.symbolList=newSymbol;
    this.state.tweetList=this.getTweetData(this.state.symbolList);

    let finalElem = this.createElements();

    this.setState({resultList: finalElem[0], allSymbols: finalElem[1]});
  }

  getTweetData(arr) {
    let dataList=[];

    for(let i=0;i<arr.length;i++){
      axios.get('https://api.stocktwits.com/api/2/streams/symbol/'+arr[i]+'.json').then((response) => {
        dataList.push(response.data.messages);
      })
    }
    return dataList;
  };

  createElements(){
    let resultList=[];
    let allSymbols=[];

    if(this.state.tweetList){

      for (let i=0;i< this.state.tweetList.length;i++){

        allSymbols.push(
          <div>
          <button type="button" class="btn btn-secondary" key="deleteButton" onClick={this.handleDelete.bind(this, this.state.symbolList[i])}> {this.state.symbolList[i]+' (Total tweets: '+this.state.tweetList[i].length+')'}</button></div>

          );

        let tempList=this.state.tweetList[i].map((tweet) =>
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
      }

    }

    return [resultList, allSymbols];

  }

  render() {
    return (
    
      <div>
      <form id="symbolForm" onSubmit={this.handleSubmit}>
      Type in the symbol: <input type="text" value={this.state.symbol} onChange={this.handleChange}/>
      <input type="submit" value="Submit" />
      </form>
      <div>{this.state.allSymbols}</div>
      <div>{this.state.resultList}</div>
    </div>
    )
    
  }
}