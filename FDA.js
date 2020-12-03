import React, { Component } from 'react';
import logo from './logo.svg';
import logo2 from './logo2.svg';
import logo3 from './logoSDPP.jpg';
import './App.css';
import web3 from './web3';
import { Button } from 'reactstrap';
import IPFS from './ipfs';
import RSabi from "./RSabi";
import OGabi from "./OGabi";
import LotBatchABI from './LBabi.json'
import RDPabi from './RPabi.json';
import Timeline from './Timeline';
import './style.scss';
import QrCode from 'react.qrcode.generator'
import QrReader from "react-qr-reader";
const getRevertReason = require('eth-revert-reason');

class FDA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer:'',
      ipfsHash:null,
      myContract: null,
      account: '',
      contractadd:'',
      qr: false,
      delay: 300,
      result: '',
      timeevents:[],
      foo: false
   };
    this.handleScan = this.handleScan.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)    
  };//Capture File

handleScan(data) {
    if (data) {
      this.setState({
        result: data
      });
    }
  }
  handleError(err) {
    console.error(err);
  }
  handleChange(event) {
    this.setState({result: event.target.value});
  }
  onScan = async(event) => {
    event.preventDefault();
    if(this.state.qr === false)
     this.setState({qr:true});
    else 
    this.setState({qr:false});
 };
  onHistory = async (event) =>{
    event.preventDefault();
    var eventarray=[] // collects all events
    var RDPadrs= document.getElementById("resellQ").value;
    var RDPcontract= new web3.eth.Contract(RDPabi, RDPadrs);
    var account= this.state.account;
    var LotBatchContractADRS='';
    var LotBatchManDate;
    var ipfsfortime;
    await RDPcontract.methods.getDetails().call(function(err, details){
      console.log(details);
      LotBatchContractADRS=details[6];
      LotBatchManDate = new Date(details[1]*1000);
      var Expirydate = new Date(details[2]*1000); 
      document.getElementById('information').innerText= 'Medicine Details: '
      document.getElementById('MedicineName').innerText= 'Medicine Name: '
      document.getElementById('MDate').innerText= 'Manufacturing Date:'
      document.getElementById('EDate').innerText= 'Expiration Date:'
      document.getElementById('Quantity').innerText= 'Quantity'
      document.getElementById('Price').innerText= 'Price'
      document.getElementById('ResellerEA').innerText= 'ResellerEA:'
      document.getElementById('LotEA').innerText= 'LotEA:'
      document.getElementById('MedicinInfo0').innerText= details[0];
      document.getElementById('MedicinInfo1').innerText= LotBatchManDate;
      document.getElementById('MedicinInfo2').innerText= Expirydate;
      var i=3;
      for(i; i<7; i++){
        document.getElementById('MedicinInfo'+[i]).innerText= details[i];
      }
      //document.getElementById('medicineInfo').innerHTML = "Medicine Name: "+details[0]+"<br>"+ "Manufacturing Date: "+LotBatchManDate+"<br>"+"Expiry Date: "+Expirydate+"<br>"+"Quantity: "+details[3]+"<br>"+"Price: "+details[4]+"<br>"+"Reseller: "+details[5]+"<br>"+"Lot Batch: "+details[6];
     //document.getElementById("Medimage").src="https://gateway.ipfs.io/ipfs/"+details.IPFS;
     ipfsfortime=details.IPFS;
    });// await get details
    
    //LotBatchContract = new web3.eth.Contract(LotBatchABI, details[6]);
       //Manudate.toDateString().substring(0,15) to stringify the date and time
    await RDPcontract.getPastEvents('allevents', {fromBlock: 0, toBlock:'latest'},function (error, events){
      console.log(events);
      events.forEach(myfunction);
      document.getElementById('History').innerText= 'Drug History:';
      function myfunction(item, index){
        if(item.event ==="ReturnedDrugApproved"){
          var temptime= new Date(item.returnValues.time*1000);
          var eventformat= {ts: temptime.toISOString(), text: item.event+": " +item.returnValues.DrugName +" has been approved", image:"https://gateway.ipfs.io/ipfs/"+ipfsfortime};
          eventarray.push(eventformat);
         // document.getElementById("ReturnedDrugApproved").innerHTML += item.event+": " +item.returnValues.DrugName +" has been approved at "+temptime+ "<br>";
        }
        else if(item.event ==="OwnerChanged"){
          var temptime= new Date(item.returnValues.time*1000);
          var eventformat= {ts: temptime.toISOString(), text: item.event+": to " +item.returnValues.OwnerType, image:''};
          eventarray.push(eventformat);
        //  this.setState({this.state.timeevents.concat(eventformat)})
         // document.getElementById("OwnerChangedRDP").innerHTML += item.event+": to " +item.returnValues.OwnerType +" at "+temptime + "<br>";
        }
        else if(item.event ==="DrugResold"){
          var temptime= new Date(item.returnValues.time*1000);
          var eventformat= {ts: temptime.toISOString(), text: item.event+": Box Number " +item.returnValues.boxNumber, image:''};
          eventarray.push(eventformat);
          //document.getElementById("DrugResold").innerHTML += item.event+": Box Number " +item.returnValues.boxNumber +" at "+temptime + "<br>";

      }
    }
    });
    var  LotBatchContract = new web3.eth.Contract(LotBatchABI,LotBatchContractADRS);
    await LotBatchContract.getPastEvents('allevents', {fromBlock: 0, toBlock:'latest'},function (error, events){
      console.log(events);
      events.forEach(myfunction);
      //document.getElementById('LotHistory').innerText= 'Lot History:';
      function myfunction(item, index){
        if(item.event ==="LotDispatched"){
          var eventformat= {ts: LotBatchManDate.toISOString(), text: item.event+": " +item.returnValues.DrugName +" has been dispatched", image:"https://gateway.ipfs.io/ipfs/"+item.returnValues.IPFS};
          eventarray.push(eventformat);
          var temptime= new Date(item.returnValues.time*1000);
          //document.getElementById("LotDispatched").innerHTML += item.event+": " +item.returnValues.DrugName +" has been dispatched ";
        }
        else if(item.event ==="OwnerChanged"){
          var temptime= new Date(item.returnValues.time*1000);
          var eventformat= {ts: temptime.toISOString(), text: item.event+": to " +item.returnValues.OwnerType, image:''};
          eventarray.push(eventformat);
         // document.getElementById("OwnerChangedLOT").innerHTML += item.event+": to " +item.returnValues.OwnerType +" at "+temptime + "<br>";

        }
        else if(item.event ==="DrugSold"){
          var temptime= new Date(item.returnValues.time*1000);
          var eventformat= {ts: temptime.toISOString(), text: item.event+": box number " +item.returnValues.boxNumber, image:''};
          eventarray.push(eventformat);
         // document.getElementById("DrugSold").innerHTML += item.event+": box number " +item.returnValues.boxNumber +" at "+temptime + "<br>";

        }
      }

    });
   console.log(eventarray);
   this.setState({ timeevents: eventarray });
   this.setState({ timeevents: eventarray });

   console.log({timeevents:eventarray});

  };
convertToBuffer = async(reader) => {
  //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
  //set this buffer -using es6 syntax
    this.setState({buffer});
};// converToBuffer
  componentDidMount = async (event) => {
    console.log('componentDidMount() lifecycle');
    this.setState({ foo: !this.state.foo });
    //event.preventDefault();
    //bring in user's metamask account address
    console.log('trying to connect to metamask');
    const accounts = await web3.eth.getAccounts();
    var ipfshash= '';
   for await (const result of IPFS.add(this.state.buffer)) {
      console.log(result)
      console.log(JSON.stringify(result));
      if (result.hasOwnProperty("path")){
        console.log(result.path);  
        ipfshash= result.path;
        this.setState({ipfsHash:result.path});
    }
  }
    console.log('Sending from Metamask account: ' + accounts[0]);
    this.setState({account:accounts[0]});
    var abi = RSabi;
    //updated
    var address = '0x36d84f758ca43564147F8e25fc3fFa9bED30E9d5';//NEW return summary

    var ReturnSummarynew= new web3.eth.Contract(abi,address);
    this.setState({contractadd : address});

  //here
  this.setState({myContract:ReturnSummarynew});
    }; //onSubmit

  onManf = async (event) =>{
    event.preventDefault();
    const ethers = require('ethers');
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    console.log(provider)
    var Mn= document.getElementById("ManfName").value;
    var OriginalSummaryAddress= '0xAd928ABe47ddA9E304786298a7678254DEf90EE1'; //NEW original
    var OGcontract= new web3.eth.Contract(OGabi,OriginalSummaryAddress);
    var account= this.state.account;
    await OGcontract.methods.registerManufacturer(Mn).send({from:account},function(error, transactionHash){  
        console.log(transactionHash);
        const revertmsg = async(transactionHash) => {
          //const getRevertReason = require("eth-revert-reason");
          console.log("Helloooo 111111");
          var y = await getRevertReason(transactionHash,'ropsten');
          console.log("Helloooo 222222");
          console.log(y);
          if(y!= '')
            alert(document.getElementById("rvm1").innerHTML = y);
           else
             alert(document.getElementById("rvm1").innerHTML = "Manufacturer Registered Successfully");
        
       };
       
       revertmsg(transactionHash);
    }
  )};
  onSs = async (event) =>{
  
    event.preventDefault();
    var sn= document.getElementById("SellerName").value;
    var OriginalSummaryAddress= '0xAd928ABe47ddA9E304786298a7678254DEf90EE1'; //new original
    var OGcontract= new web3.eth.Contract(OGabi,OriginalSummaryAddress);
    var account= this.state.account;
    await OGcontract.methods.registerSeller(sn).send({from:account}, function(error, transactionHash){
        
        console.log(transactionHash);
        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
        if(y!= '')
        alert(document.getElementById("rvm2").innerHTML = y);
        else
          alert(document.getElementById("rvm2").innerHTML = "Seller Registered Successfully");
        
       };
       
       revertmsg(transactionHash);
    }
    //console.log(reciept);

  )};
   onCA = async (event) =>{
    event.preventDefault();
    var can= document.getElementById("CAName").value;
    var contractnew= this.state.myContract;
    var account= this.state.account;
    await contractnew.methods.regiterCA(can).send({from:account},function(error, transactionHash){  
        console.log(transactionHash);
        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
         if(y!= '')
        alert(document.getElementById("rvm3").innerHTML = y);
        else
          alert(document.getElementById("rvm3").innerHTML = "Certification Agency Registered Successfully");
        
       };
       
       revertmsg(transactionHash);
    }
  )};
  onRs = async (event) =>{
  
    event.preventDefault();
    var rn= document.getElementById("ResellerName").value;
    var contractnew= this.state.myContract;
    var account= this.state.account;
  
    await contractnew.methods.regiterReseller(rn).send({from:account}, function(error, transactionHash){
        
        console.log(transactionHash);
        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
        if(y!= '')
        alert(document.getElementById("rvm4").innerHTML = y);
        else
          alert(document.getElementById("rvm4").innerHTML = "Reseller Registered Successfully");
        
       };
       
       revertmsg(transactionHash);
    }
    //console.log(reciept);

  )};
  state = { ViewHistory: true}

  state = { Register: true}
   
  render() {
    const { ViewHistory } = this.state;
    const { Register } = this.state;
    return (
  

    
    <div className="App">
      <header className="App-header_4pages">
      <img src= {logo3} className="App-logo3" alt="logo"></img>
      <div class="pagesPharmatext" >
     <b>  PharmaChain</b>
    <br/> 
    <br/> 
    </div>
    <div class="welcometxt" >
     <b>  Welcome to the FDA page </b>
    <br/> 
    </div>
  
      </header>
      <div  >
      <br/> 
    <br/> 
               {  Register && (
                    <div id="the div you want to show and hide">
                       <br/> 
      <b style={{ color: 'rgb(204, 221, 255)' }}> Enter the corresponding Ethereum Address to register a Manufacturer, Seller, CA or a Reseller: </b>
      <br/>
      <br/>
          <form onSubmit={this.onManf}>
            <input type = "text" id="ManfName" class="mytext" />
            
             <button class="button1" type="submit">  Register Manufacturer </button>
          </form>
          <p style={{ color: 'rgb(255, 255, 255)' }}  id="rvm1"></p> 
          <form onSubmit={this.onSs}>
            <input type = "text" id="SellerName" class="mytext" />
           
             <button class="button1" type="submit">  Register Seller </button>
          </form>
          <p style={{ color: 'rgb(255, 255, 255)' }}  id="rvm2"></p> 
          
          <form onSubmit={this.onCA}>
            <input type = "text" id="CAName" class="mytext" />
          
             <button class="button1" type="submit">  Register CA </button>
          </form>
          <p  style={{ color: 'rgb(255, 255, 255)' }}  id="rvm3"></p> 

          <form onSubmit={this.onRs}>
            <input type = "text" id="ResellerName" class="mytext"/>
           
             <button class="button1" type="submit">  Register Reseller </button>
          </form>
          <p  style={{ color: 'rgb(255, 255, 255)' }}  id="rvm4"></p> 
      
          </div>
           
          )} <button class="barButtons barButtons1" onClick={() => this.setState({ Register: !Register })}>
          { Register ? 'Cancel' : 'Register a stakeholder' }
      </button>  
                   
          </div>
             
               
                
    { ViewHistory && (
                    <div  id="the div you want to show and hide">
         <br/>
    <b style={{ color: 'rgb(204, 221, 255)' }}> To view medicine history: 1) Click (Read QR Code) to enable camera and scan the medicine barcode. </b> 
                 
                 <br/> <br/>
                 <b style={{ color: 'rgb(204, 221, 255)' }}> 2) Once the Ethereum address is shown click (View History).  </b> 
                 <br/>
                 <br/>
                 <form onSubmit={this.onScan}>
          <button  class="button" type="submit"> Read QR Code </button>
          </form>
          {/* <h1>{ this.state.g2 == true ? <QrCode value={this.state.qr2} QrCode size = {'400'}/> : '' } </h1> */}
          <h1> { this.state.qr=== true && this.state.result === '' ? <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "25%" }}
        />  : ''} </h1>
        <p style={{ color: 'rgb(255, 255, 255)' }}>{this.state.result2}</p>
          <form onSubmit={this.onHistory}>
            <input type = "text" id="resellQ"  class="mytext" value={this.state.result} onChange={this.handleChange} />
             <button class="button1" type="submit">  View History </button>
             
          </form>
         
          <h2  style={{ color: 'rgb(255, 255, 255)' }}  id="information"></h2>
          <table class= "center" style={{  color: 'rgb(255, 255, 255)'}}>
            
          <tr>
    <th id='MedicineName'></th>
    <td id='MedicinInfo0'></td> 
  </tr>
  <tr>
    <th id='MDate'></th>
    <td id='MedicinInfo1'></td> 
  </tr>
  <tr>
  <th id='EDate'></th>
    <td id='MedicinInfo2'></td> 
  </tr>
  <tr>
  <th id='Quantity'></th>
    <td id='MedicinInfo3'></td> 
  </tr>
  <tr>
  <th id='Price'></th>
    <td id='MedicinInfo4'></td> 
  </tr>
  <tr>
  <th id='ResellerEA'></th>
    <td id='MedicinInfo5'></td> 
  </tr>
  <tr>
  <th id='LotEA'></th>
    <td id='MedicinInfo6'></td> 
  </tr>
</table>
      
          <p  style={{ color: 'rgb(255, 255, 255)' }}  id="medicineInfo"></p>
          <img src='' id="Medimage"></img>
          <h2  style={{ color: 'rgb(255, 255, 255)' }}  id="History"></h2>
          <Timeline items={this.state.timeevents} />

    </div> 
                )} 
                    <br/>   <button class="barButtons barButtons1" onClick={() => this.setState({ ViewHistory: !ViewHistory })}>
                    { ViewHistory ? 'Cancel' : 'View Medicine History' }
                </button>    <br/>    <br/>    <br/>
                      </div>  
                  


    
  );// return
  }// render()
}// App
export default FDA;

       