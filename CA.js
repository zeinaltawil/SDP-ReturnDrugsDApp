import React, { Component } from 'react';
import { Button } from 'reactstrap';
import logo3 from './logoSDPP.jpg';
import './App.css';
import web3 from './web3';
import IPFS from './ipfs';
import ReactDOM from "react-dom";
import QrCode from 'react.qrcode.generator';
import QrReader from "react-qr-reader";
import RPabi from "./RPabi.json";
import RSabi from "./RSabi";
import moment from 'moment';
import LBabi from "./LBabi.json";
import RDPabi from './RPabi.json';
import Timeline from './Timeline';
import './style.scss';

class CA extends Component {  
  constructor(props) {
    super(props);
    this.state = {
    buffer:'',
    ipfsHash:null,
    myContract: null,
    account: '',
    contractadd:'',
    r: false,
    qr: false,
    qr2: false,
    qr3: false,
    delay: 300,
    ea:'',
    qrAdd:'',
    g: false,
    g2: false,// for on History
    g3: false, // for change owner
    SummaryContract:'',
    result: '',
    result2: '', //for on Historyog
    result3: '', //for change owner
    Mdate:'',
    timeevents:[]
  };
    this.handleScan = this.handleScan.bind(this);
    this.handleScan2 = this.handleScan2.bind(this);
    this.handleScan3 = this.handleScan3.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
  }

   componentDidMount = async (event) => {
  const accounts = await web3.eth.getAccounts();
   this.setState({account:accounts[0]});
   console.log(this.state.account);
   var Summaryabi = RSabi;
    var Summaryaddress = '0x36d84f758ca43564147F8e25fc3fFa9bED30E9d5'; //new return summary
    var ReturnSummarynew= new web3.eth.Contract(Summaryabi,Summaryaddress);
    this.setState({SummaryContract:ReturnSummarynew});
    console.log(this.state.SummaryContract);
};


 handleScan(data) {
    if (data) {
      this.setState({
        result: data
      });// set state
      // getDetailss() to get medicine
document.getElementById('LotEA').value= this.state.result;
      var LotBatchcontract= new web3.eth.Contract(LBabi, this.state.result);
    var account= this.state.account;
    const ethers = require('ethers');
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    console.log(provider)
    LotBatchcontract.methods.getDetails().call(function(err, details){
  
      console.log(details);
      console.log(err);
      const options = {year: 'numeric', day: 'numeric',month: 'numeric'}
      var LotBatchManDate = new Date(details[1]*1000);
      var shortDate= LotBatchManDate.toLocaleDateString('en-us', 'option');
      var Expirydate = new Date(details[2]*1000); 
      var CalendarMdate = LotBatchManDate.toISOString().split('T')[0];
      var CalendarEdate = Expirydate.toISOString().split('T')[0];
      document.getElementById("medicine").value= details[0];
      document.getElementById("mdate").value= CalendarMdate;
      document.getElementById("edate").value= CalendarEdate;
      console.log(details[3]);
      var  ipfstest =details[3];
      document.getElementById("image2").src= "https://gateway.ipfs.io/ipfs/" + ipfstest;
    });// await getdetails
    }// if data
  }; //handlescan

    handleChange(event) {
    this.setState({result: event.target.value});
  }
  handleDateChange(event){
this.setState({Mdate: event.target.value});
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
onScan3 = async(event) => {
    this.setState({g3:true});
    event.preventDefault();
    if(this.state.qr3 === false)
     this.setState({qr3:true});
    else 
    this.setState({qr3:false});
 };
 handleScan3(data) {
    if (data) {
      this.setState({
        result3: data
      });
    }
  };
  handleChange3(event) {
    this.setState({result3: event.target.value});
  }
  handleError3(err) {
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



  onSubmit = async (event) => {
    event.preventDefault();
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
    var abi = RPabi;
    var ReturnSummaryAddress= '0x36d84f758ca43564147F8e25fc3fFa9bED30E9d5'; //new return summary
    var bin= '0x60806040523480156200001157600080fd5b50604051620013be380380620013be83398181016040526101008110156200003857600080fd5b8101908080519060200190929190805160405193929190846401000000008211156200006357600080fd5b838201915060208201858111156200007a57600080fd5b82518660018202830111640100000000821117156200009857600080fd5b8083526020830192505050908051906020019080838360005b83811015620000ce578082015181840152602081019050620000b1565b50505050905090810190601f168015620000fc5780820380516001836020036101000a031916815260200191505b506040526020018051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190805160405193929190846401000000008211156200015257600080fd5b838201915060208201858111156200016957600080fd5b82518660018202830111640100000000821117156200018757600080fd5b8083526020830192505050908051906020019080838360005b83811015620001bd578082015181840152602081019050620001a0565b50505050905090810190601f168015620001eb5780820380516001836020036101000a031916815260200191505b5060405250505086600090805190602001906200020a92919062000497565b50856004819055508460058190555033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600381905550826001819055506040518060400160405280600281526020017f434100000000000000000000000000000000000000000000000000000000000081525060069080519060200190620002b592919062000497565b5080600a9080519060200190620002ce92919062000497565b5081600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555087600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f384e4f810f761fd9a477864befeabe354840cc2673ed21391887a94fa0d8079d306000600354600154600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1642604051808773ffffffffffffffffffffffffffffffffffffffff168152602001806020018681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828103825287818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015620004765780601f106200044a5761010080835404028352916020019162000476565b820191906000526020600020905b8154815290600101906020018083116200045857829003601f168201915b505097505050505050505060405180910390a150505050505050506200054d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282620004cf57600085556200051b565b82601f10620004ea57805160ff19168380011785556200051b565b828001600101855582156200051b579182015b828111156200051a578251825591602001919060010190620004fd565b5b5090506200052a91906200052e565b5090565b5b80821115620005495760008160009055506001016200052f565b5090565b610e61806200055d6000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80637d307307116100715780637d307307146102a55780638da5cb5b146102d357806393e67bff14610307578063c74d97cd1461038a578063cc7e0b5d146103be578063fbbf93a0146103dc576100b4565b806317aaf87b146100b957806317fc45e2146100ed578063284106f81461010b5780633b710f8c14610129578063516dde43146102045780635188ab7b14610222575b600080fd5b6100c1610521565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100f5610547565b6040518082815260200191505060405180910390f35b61011361054d565b6040518082815260200191505060405180910390f35b6102026004803603604081101561013f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561017c57600080fd5b82018360208201111561018e57600080fd5b803590602001918460018302840111640100000000831117156101b057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610553565b005b61020c61073f565b6040518082815260200191505060405180910390f35b61022a610745565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561026a57808201518184015260208101905061024f565b50505050905090810190601f1680156102975780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102d1600480360360208110156102bb57600080fd5b81019080803590602001909291905050506107e3565b005b6102db610b86565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61030f610bac565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561034f578082015181840152602081019050610334565b50505050905090810190601f16801561037c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610392610c4a565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103c6610c70565b6040518082815260200191505060405180910390f35b6103e4610c76565b60405180806020018981526020018881526020018781526020018681526020018573ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1681526020018060200183810383528b818151815260200191508051906020019080838360005b8381101561047857808201518184015260208101905061045d565b50505050905090810190601f1680156104a55780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156104de5780820151818401526020810190506104c3565b50505050905090810190601f16801561050b5780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60035481565b60045481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610616576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f4f776e6572206e6f7420617574686f72697a65642e000000000000000000000081525060200191505060405180910390fd5b81600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507fc515b0a178c8ec286db4b246f1381d81529cbd7940b056b4ed3d96dc5a5c47be600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168242604051808473ffffffffffffffffffffffffffffffffffffffff16815260200180602001838152602001828103825284818151815260200191508051906020019080838360005b838110156106ff5780820151818401526020810190506106e4565b50505050905090810190601f16801561072c5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a15050565b60055481565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107db5780601f106107b0576101008083540402835291602001916107db565b820191906000526020600020905b8154815290600101906020018083116107be57829003601f168201915b505050505081565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146108a6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f4f776e6572206e6f7420617574686f72697a65642e000000000000000000000081525060200191505060405180910390fd5b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634bedcc29336040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561092f57600080fd5b505afa158015610943573d6000803e3d6000fd5b505050506040513d602081101561095957600080fd5b81019080805190602001909291905050506109dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f526573656c6c6572206e6f7420617574686f72697a65642e000000000000000081525060200191505060405180910390fd5b600b600082815260200190815260200160002060009054906101000a900460ff1615610a70576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f4472756720426f78205265736f6c64000000000000000000000000000000000081525060200191505060405180910390fd5b4260055411610ae7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f447275672068617320657870697265640000000000000000000000000000000081525060200191505060405180910390fd5b600360008154809291906001900391905055506001600b600083815260200190815260200160002060006101000a81548160ff0219169083151502179055507fcf93389593cde6541b50c8ce48a025f1a3c500edd0488f62bc1038e89b197a8c308242604051808473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a150565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600a8054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c425780601f10610c1757610100808354040283529160200191610c42565b820191906000526020600020905b815481529060010190602001808311610c2557829003601f168201915b505050505081565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b606060008060008060008060606000600454600554600354600154600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600a878054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d6e5780601f10610d4357610100808354040283529160200191610d6e565b820191906000526020600020905b815481529060010190602001808311610d5157829003601f168201915b50505050509750808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e0a5780601f10610ddf57610100808354040283529160200191610e0a565b820191906000526020600020905b815481529060010190602001808311610ded57829003601f168201915b5050505050905097509750975097509750975097509750909192939495969756fea26469706673582212204ec8aa121d936cc8f36e99e5927469b2a653d1689c2653e58219d97f39df72c264736f6c63430007040033';
    var myContract= new web3.eth.Contract(abi);
    var ReturnedPackagenew;
    var a = document.getElementById("medicine").value;
    var b = document.getElementById("mdate").value;
    var epocB = moment(b, 'YYYY/MM/DD').unix();
    b = epocB;
    var c = document.getElementById("edate").value;
    var epocC = moment(c, 'YYYY/MM/DD').unix();
    c = epocC;
    var d = document.getElementById("quant").value;
    var e = document.getElementById("price").value;
    var f = document.getElementById("LotEA").value;
    var g = this.state.ipfsHash;
    //myContract.options.data= bin;
    await myContract.deploy({data: bin,arguments:[ReturnSummaryAddress,a,b,c,d,e,f,g]}).send({
      from: accounts[0]
  })
  .then(function(newContractInstance){
      ReturnedPackagenew= newContractInstance;
      alert(document.getElementById("demo").innerHTML = "Your contract got deployed successfully at address: "+newContractInstance.options.address);
      console.log(newContractInstance.options.address) // instance with the new contract address

  });
  document.getElementById("image2").src ="https://gateway.ipfs.io/ipfs/"+this.state.ipfsHash;
  this.setState({myContract:ReturnedPackagenew});
  this.setState({qrAdd:this.state.myContract.options.address});
  this.setState({g:true});

const AddToSummary = async (Radd)=> {
        await this.state.SummaryContract.methods.approveReturnedPackage(Radd).send({from:this.state.account},function(error, transactionHash){   
        console.log(transactionHash);

        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
        if(y!= '')
        alert(document.getElementById("rvm4").innerHTML = y);
        else
          alert(document.getElementById("rvm4").innerHTML = "Returened Package is Successfully added to the Returned Drug Summary");
        
       };
       
       revertmsg(transactionHash);
      }

)};
 console.log('now try to add to summary');
var Radd = this.state.myContract.options.address;
AddToSummary(Radd);
};
  //here

onClick2 = async (event) => {
    event.preventDefault();
    var RPadd = document.getElementById("RPadd").value;
    var resellerAdd = document.getElementById("ResellerA").value;
    var resellerName = document.getElementById("ResellerN").value;
    var myContract= new web3.eth.Contract(RPabi,RPadd);
    console.log(resellerAdd)
    console.log(resellerName)
    await myContract.methods.changeOwner(resellerAdd,resellerName).send({from:this.state.account}, function(error, transactionHash){
        console.log(error)
        console.log(transactionHash);
        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
        if(y!= '')
        alert(document.getElementById("rvm7").innerHTML = y);
        else
          alert(document.getElementById("rvm7").innerHTML = "Drug Owner Changed");
        
       };
       
       revertmsg(transactionHash);

  })
  }; //onClick2 for change owner

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



  state = { showDeploy: true}
  state = { showChangeOwner: true}
  state = { ViewHistory: true}
  render() {
    
    const { showDeploy } = this.state
    const { showChangeOwner } = this.state;
    const { ViewHistory } = this.state;
    return (
    <div class="App" >
      <header className="App-header_4pages">

      <img src= {logo3} className="App-logo3" alt="logo"></img>
      <div class="pagesPharmatext" >
     <b>  PharmaChain</b>
    <br/> 
    <br/> 
    </div>
    <div class="welcometxt" >
     <b>  Welcome to the Certification Agencies page </b>

    </div>
   
      </header>
      <div class="center">

  
        <div>
            
            { showDeploy && (
                <div id="the div you want to show and hide">
 
          
                       <p style={{ color: 'rgb(255, 255, 255)'}}id="demo"></p>
                      
                <b style={{ color: 'rgb(204, 221, 255)' }}>To Deploy a Returned Package: 1) Fill in the the following fields or scan QR code to get medicine information. </b>
                <br/> <br/>
                <b style={{ color: 'rgb(204, 221, 255)' }}> 2) Upload a picture of the Medicine and deploy.  </b>
                    <br/>
                    <br/>
                    <form onSubmit={this.onScan}>

           <button class="button"> Read QR Code </button>
                     </form>
                     
        <h1 > { this.state.qr== true && this.state.result == '' ? <QrReader
        delay={this.state.delay}
        onError={this.handleError}
        onScan={this.handleScan}
        style={{ width: "25%" }}
      />  : ''} </h1>


                    <form  onSubmit={this.onClick}>
                    <input style={{ color: 'rgb(255, 255, 255)'}}
                        type = "file"
                        onChange = {this.captureFile}
                      />
          
                       <form onSubmit={this.onSubmit}>
          
                       <div class = "center">
                       <br/>
                       <table  style={{ color: 'rgb(255, 255, 255)' }}>
                      <tr>
                             <td> Medicine EA:
                             </td>
                             <td>
                                 <input type="text" id="LotEA" align="left" class="mytextS"/>
                             </td>
                         </tr>
                         <tr>
                             <td> Medicine Name:
                             </td>
                             <td>
                                 <input type="text" id="medicine" align="left" class="mytextS"/>
                             </td>
                         </tr>
                          <tr>
                             <td> Manu date:
                             </td>
                             <td>
                                 <input type="date" id="mdate" align="left" class="mytextS"/>
                             </td>
                         </tr>
                         <tr>
                             <td> Expiry date:
                             </td>
                             <td>
                                 <input type="date" id="edate" align="left" class="mytextS"/>
                             </td>
                         </tr>
                          <tr>
                             <td> Quantity:
                             </td>
                             <td>
                                 <input type="text" id="quant" align="left" class="mytextS"/>
                             </td>
                         </tr>
                         <tr>
                             <td> Price:
                             </td>
                             <td>
                                 <input type="text"  id="price" align="left" class="mytextS"/>
                             </td>
                         </tr>
                     </table>
                     <br/>
                 </div>
                 <button class="button" type="submit" block>  Deploy a Returned Package </button>
                   
                    </form>
                    </form>
                      
                    <p style={{ color: 'rgb(255, 255, 255)' }} id="rvm1"></p> 
          
                    <img  height="300" width="300" id="image2" />         
                    <p style={{ color: 'rgb(255, 255, 255)' }}> {this.state.result}</p>
        <h1>{ this.state.g == true ? <QrCode value={this.state.qrAdd} QrCode size = {'400'}/> : '' } </h1> 
        <p style={{ color: 'rgb(255, 255, 255)' }}id="rvm4"></p>
        <p style={{ color: 'rgb(255, 255, 255)' }}id="rvm2"></p> 
        
          </div>
            )}
         <button class="barButtons barButtons1" onClick={() => this.setState({ showDeploy: !showDeploy })}>
                { showDeploy ? 'Cancel' : 'Create a Returned Package' }
            </button>
        </div>  

        <div>
        <br/>
               
                { showChangeOwner && (
                    <div id="the div you want to show and hide">
                          <form onSubmit={this.onScan3}>
                            <br/>
                            <b style={{ color: 'rgb(204, 221, 255)' }}> To change owner: Scan QR code to get Returened Package Address and fill in other fields.    </b>
                            <br/> 
                            <br/> 
          <button class="button" type="submit"> Read QR Code </button>
          </form>
          {/* <h1>{ this.state.g3 == true ? <QrCode value={this.state.qr3} QrCode size = {'400'}/> : '' } </h1> */}
          <h1> { this.state.qr3=== true && this.state.result3 === '' ? <QrReader
          delay={this.state.delay}
          onError={this.handleError3}
          onScan={this.handleScan3}
          style={{ width: "25%" }}
        />  : ''} </h1>
        <p style={{ color: 'rgb(255, 255, 255)' }}>{this.state.result3}</p>
                    <form onSubmit={this.onClick2}>
            
                    <div class = "center">
                      
                                   <table  style={{ color: 'rgb(255, 255, 255)' }}>
                                  <tr>
                                         <td> Returned Package Address:
                                         </td>
                                         <td>
                                             <input type="text" id="RPadd" align="left" class="mytextS" value={this.state.result3} onChange={this.handleChange3}/>
                                         </td>
                                     </tr>
                                     <tr>
                                         <td> Reseller Address:
                                         </td>
                                         <td>
                                         <input type="text" id="ResellerA" align="left" class="mytextS"/>
                                         </td>
                                     </tr>
                                      <tr>
                                         <td> Reseller Name:
                                         </td>
                                         <td>
                                         <input type="text" id="ResellerN" align="left" class="mytextS"/>
                                         </td>
                                     </tr>
                                 </table>
                      
                             </div>
                             <br/>
                    
                     <button  class="button" type="submit">  Change Owner </button>
                     </form>
                     <p style={{ color: 'rgb(255, 255, 255)' }} id="rvm7"></p> 
            
            
                        

                    </div>
                )}  <button class="barButtons barButtons1" onClick={() => this.setState({ showChangeOwner: !showChangeOwner })}>
                { showChangeOwner ? 'Cancel' : ' Change Medicine Owner' }
            </button>
            </div> 

       


        </div>

            <div class= "center">

            
                { ViewHistory && (
                    <div  id="the div you want to show and hide">
         <br/>
    <b style={{ color: 'rgb(204, 221, 255)' }}> To view medicine history: 1) Click (Read QR Code) to enable camera and scan the medicine barcode. </b> 
                 
                 <br/>  <br/>
                 <b style={{ color: 'rgb(204, 221, 255)' }}> 2) Once the Ethereum address is shown click (View History).  </b> 
                 <br/>
                 <br/>



      <form onSubmit={this.onScan2}>
          <button  class="button" type="submit"> Read QR Code </button>
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
                )} <button class="barButtons barButtons1" onClick={() => this.setState({ ViewHistory: !ViewHistory })}>
                { ViewHistory ? 'Cancel' : 'View Medicine History' }
            </button>
    </div>

    </div>
    
  );// return
  }// render()




}
export default CA;

       