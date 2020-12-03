import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import logo2 from './logo2.svg';
import App1 from './App1.js';
import App2 from './App2.js';
import LotBatch from './LotBatch.js';
import FDA from './FDA.js';
import Patients from './Patients.js';
import Sellers from './Sellers.js';
import Reseller from './Reseller.js';
import Manufacturers from './Manufacturers.js';
import CA from './CA.js';
import web3 from './web3';
import { Button } from 'reactstrap'; 
import Navigation from './Navigation.js';
import RSabi from "./RSabi";
import OGabi from "./OGabi";

// HOME PAGE TEXT STYLES
const NAMEHOMEstyle ={
  color: 'white', fontSize: '60px'
}

const QUOTEOMEstyle ={
  color: 'rgb(153, 187, 255)', fontSize: '40px'
}

class App extends Component {
state={
    account: '',
    type:'',
  }
   componentDidMount = async (event) => {
  const accounts = await web3.eth.getAccounts();
   this.setState({account:accounts[0]});
  //  var OGadrs='0xAd928ABe47ddA9E304786298a7678254DEf90EE1';
  //  var type1=' ', type2=' ';
  //  var OGSummaryContract= new web3.eth.Contract(OGabi,OGadrs);
  // await OGSummaryContract.methods.AutoAthuentication().call({from:this.state.account},function(error, Usertype){  
  //   console.log(Usertype);
  //   type1=Usertype;
  //   console.log(error);
  // });
  // var RSadrs='0x36d84f758ca43564147F8e25fc3fFa9bED30E9d5';
  // var RSSummaryContract= new web3.eth.Contract(RSabi,RSadrs);
  // await RSSummaryContract.methods.AutoAthuentication().call({from:this.state.account},function(error, Usertype){   
  //   console.log(Usertype);
  //   type2=Usertype;
  //   console.log(error);
  // });
  // if(type1!= 'None' && type1!= null){
  //   console.log(type1);
  //   this.setState({type:type1});
  // } 
  // if(type2!= 'None' && type2!= null){
  //   console.log(type2);
  //   this.setState({type:type2});
  // }
  // if(type1== 'None' && type2== 'None'){
  //   this.setState({type:'Patients'});
  // }
};
renderRedirect = () => {
    
      return <Redirect to={"./" + this.state.type}/>
    
  };

  onType = async (event) =>{
    event.preventDefault();
    this.setState({type : document.getElementById("type").value});
    var OGadrs='0xAd928ABe47ddA9E304786298a7678254DEf90EE1';
    var type1=' ', type2=' ';
    var OGSummaryContract= new web3.eth.Contract(OGabi,OGadrs);
   await OGSummaryContract.methods.AutoAthuentication().call({from:this.state.account},function(error, Usertype){  
     console.log(Usertype);
     type1=Usertype;
     console.log(error);
   });
   var RSadrs='0x36d84f758ca43564147F8e25fc3fFa9bED30E9d5';
   var RSSummaryContract= new web3.eth.Contract(RSabi,RSadrs);
   await RSSummaryContract.methods.AutoAthuentication().call({from:this.state.account},function(error, Usertype){   
     console.log(Usertype);
     type2=Usertype;
     console.log(error);
   });
   if(type1!= 'None' && type1!= null){
     console.log(type1);
     this.setState({type:type1});
   } 
   if(type2!= 'None' && type2!= null){
     console.log(type2);
     this.setState({type:type2});
   }
   if(type1== 'None' && type2== 'None'){
     this.setState({type:'Patients'});
   }
  };
  render() {
    return (      
       <BrowserRouter>
        <div>
         <form onSubmit={this.onType}>
            Type: <input type = "text" id="type"/>
             <Button  type="submit">  Submit </Button>
          </form>
        {this.state.type != null ? this.renderRedirect() : ''}

          <Navigation />
            <Switch>
             <Route path="/App1" component={App1}/>
             <Route path="/App2" component={App2}/>
             <Route path="/LotBatch" component={LotBatch}/>
             <Route path="/FDA" component={FDA}/>
             <Route path="/Manufacturers" component={Manufacturers}/>
             <Route path="/Sellers" component={Sellers}/>
            <Route path="/CA" component={CA}/>
             <Route path="/Reseller" component={Reseller}/>
             <Route path="/Patients" component={Patients}/>
              <header className="App-header_4pages">
              <br/> <br/> <br/> 
       
       <img src={logo} className="App-logo" alt="logo" id="image1" />
       <img src={logo2} className="App-logo2" alt="logo2" id="image3" />
       <br/>  

      
      <b style = {NAMEHOMEstyle} > PharmaChain </b>
   
  

<br/>   <br/>   <br/>  
    <b style = {QUOTEOMEstyle} >  RECYCLE YOUR MEDICINE, SAVE LIVES </b> 
    <br/>  



          
          
</header>
     </Switch>
  </div> 
</BrowserRouter>
);
}
}

export default App;