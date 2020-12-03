import React, { Component } from 'react';
import logo3 from './logoSDPP.jpg';
import './App.css';
import web3 from './web3';
import { Button } from 'reactstrap';
import IPFS from './ipfs';
import QrCode from 'react.qrcode.generator'
import QrReader from "react-qr-reader";
import LBabi from "./LBabi.json";
import RDPabi from './RPabi.json';
import Timeline from './Timeline';
import './style.scss';
class Sellers extends Component {
  constructor(props) {
    super(props);
    this.state = {
    buffer:'',
    ipfsHash:null,
    myContract: null,
    account: '',
    contractadd:'',
    qrAdd:'',
    g: false,
    g2: false,
    r: false,
    qr: false,
    qr2: false,
    delay: 300,
    SummaryContract:'',
    delay: 300,
    result: '',
    result2: '',
    timeevents:[]
    };
    this.handleScan = this.handleScan.bind(this);
    this.handleScan2 = this.handleScan2.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

   componentDidMount = async (event) => {
  const accounts = await web3.eth.getAccounts();
   this.setState({account:accounts[0]});
};


 handleScan(data) {
    if (data) {
      this.setState({
        result: data
      });
    }
  };
    handleChange(event) {
    this.setState({result: event.target.value});
  }
  handleError(err) {
    console.error(err);
  };
  onScan = async(event) => {
    event.preventDefault();
    if(this.state.qr === false)
      this.setState({qr:true});
    else 
      this.setState({qr:false});
 };
 onScan2 = async(event) => {
    this.setState({g2:true});
    event.preventDefault();
    if(this.state.qr2 === false)
     this.setState({qr2:true});
    else 
    this.setState({qr2:false});
 };
 handleScan2(data) {
    if (data) {
      this.setState({
        result2: data
      });
    }
  };
  handleChange2(event) {
    this.setState({result2: event.target.value});
  }
  handleError2(err) {
    console.error(err);
  };
  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)    
  };//Capture File

convertToBuffer = async(reader) => {
  //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
  //set this buffer -using es6 syntax
    this.setState({buffer});
};// converToBuffer

  onSell = async (event) =>{
    event.preventDefault();
    var sellQ= document.getElementById("sellQ").value;
    var sellAdd = document.getElementById("sellAdd").value;
    var contractnew= new web3.eth.Contract(LBabi,sellAdd);
    var account= this.state.account;
    await contractnew.methods.sellDrug(sellQ).send({from:account},function(error, transactionHash){
        
        console.log(transactionHash);

        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
        if(y!= '')
        alert(document.getElementById("rvm1").innerHTML = y);
        else
          alert(document.getElementById("rvm1").innerHTML = "Drug Sold Successfully");
       };
       
       revertmsg(transactionHash);
    }
  )};

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
    var  LotBatchContract = new web3.eth.Contract(LBabi,LotBatchContractADRS);
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

  };//OnHistory
  state = { SellDrugg: true}
  state = { ViewHistory: true}
  render() {
    const { ViewHistory } = this.state;
    const { SellDrugg } = this.state;
    return (
    <div class="App">
      <header className="App-header_4pages">
      <img src= {logo3} className="App-logo3" alt="logo"></img>
      <div class="pagesPharmatext" >
     <b>  PharmaChain</b>
    <br/> 
    </div>
    <div class="welcometxt" >
    <br/> 
     <b>  Welcome to the Sellers page </b>
 
    </div>
    
      </header>
      <div class="center">
     
                { SellDrugg && (
                    <div id="the div you want to show and hide">
                       <br/>
      <br/>
      <b style={{ color: 'rgb(204, 221, 255)' }}> To Sell medicine: 1) Click (Scan QR Code) to enable camera and read the medicine barcode. </b> 
      <br/>
      <br/>
       <b style={{ color: 'rgb(204, 221, 255)' }}> 2) Once the Ethereum address is shown, specify the quantity and sell.  </b> 
       <br/>
       <br/>
          <form onSubmit={this.onScan}>
          <button  class="button" type="submit"> Scan QR Code </button>
          </form>
          <h1> { this.state.qr== true && this.state.result == '' ? <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "25%" }}
        />  : ''} </h1>
        <p style={{ color: 'rgb(255, 255, 255)' }}>{this.state.result}</p>
        
          <form onSubmit={this.onSell}>

          <div class = "center">
           <table style={{ color: 'rgb(255, 255, 255)' }}>
           <tr>
                   <td>Medicine EA:
                   </td>
                   <td>
                       <input type="text"  id="sellAdd"  align="left" class="mytext" value={this.state.result} onChange={this.handleChange} />
                   </td>
            </tr>

            <tr>
                   <td>Medicine Quantity:
                   </td>
                   <td>
                       <input type="text"id= "sellQ" align="left"  class="mytext"/>
                   </td>
            </tr>
               
           </table>

       </div>
       <br/> 
             <button class="button" type="submit">  Sell Drug </button>
          </form>
          <p  style={{ color: 'rgb(255, 255, 255)' }}  id="rvm1"></p> 
          </div>
        
           )}  <button class="barButtons barButtons1" onClick={() => this.setState({ SellDrugg: !SellDrugg })}>
           { SellDrugg ? 'Cancel' : 'Sell Medicine' }
       </button>
              </div>
    <div class= "center">
   
                { ViewHistory && (
                    <div id="the div you want to show and hide">
         <br/>
         <b style={{ color: 'rgb(204, 221, 255)' }}> To view medicine history: 1) Click (Read QR Code) to enable camera and scan the medicine barcode. </b> 
                 
         <br/>      <br/>
                 <b style={{ color: 'rgb(204, 221, 255)' }}> 2) Once the Ethereum address is shown click (View History).  </b> 
                 <br/>
                 <br/>
      <form onSubmit={this.onScan2}>
          <button class="button" type="submit"> Read QR Code </button>
          </form>
          {/* <h1>{ this.state.g2 == true ? <QrCode value={this.state.qr2} QrCode size = {'400'}/> : '' } </h1> */}
          <h1> { this.state.qr2=== true && this.state.result2 === '' ? <QrReader
          delay={this.state.delay}
          onError={this.handleError2}
          onScan={this.handleScan2}
          style={{ width: "25%" }}
        />  : ''} </h1>
        <p style={{ color: 'rgb(255, 255, 255)' }}>{this.state.result2}</p>
          <form onSubmit={this.onHistory}>
            <input type = "text" id="resellQ"  class="mytext" value={this.state.result2} onChange={this.handleChange2} />
             <button class="button1"  type="submit">  View History </button>
             
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
                 <button class="barButtons barButtons1" onClick={() => this.setState({ ViewHistory: !ViewHistory })}>
                    { ViewHistory ? 'Cancel' : 'View Medicine History' }
                </button>
                
    </div>
    </div>
    
  );// return
  }// render()
}// App


export default Sellers;
