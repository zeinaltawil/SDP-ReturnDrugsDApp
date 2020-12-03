import React, { Component } from 'react';
import logo3 from './logoSDPP.jpg';
import './App.css';
import web3 from './web3';
import { Button } from 'reactstrap';
import IPFS from './ipfs';
import QrCode from 'react.qrcode.generator'
import QrReader from "react-qr-reader";
import LBabi from "./LBabi.json";
import OGabi from "./OGabi.json";
import moment from 'moment';
import RDPabi from './RPabi.json';
import Timeline from './Timeline';
import './style.scss';

class Manufacturers extends Component {
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
    SummaryContract:'',
    delay: 300,
    result: '',
    result2:'',
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
   var Summaryabi = OGabi;
   var Summaryaddress = '0xAd928ABe47ddA9E304786298a7678254DEf90EE1';// new original summary
   var OriginalSummarynew= new web3.eth.Contract(Summaryabi,Summaryaddress);
   this.setState({SummaryContract:OriginalSummarynew});
   console.log(this.state.SummaryContract);
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
    var abi = LBabi;

  var bin= '0x60806040523480156200001157600080fd5b506040516200146238038062001462833981810160405260e08110156200003757600080fd5b8101908080519060200190929190805160405193929190846401000000008211156200006257600080fd5b838201915060208201858111156200007957600080fd5b82518660018202830111640100000000821117156200009757600080fd5b8083526020830192505050908051906020019080838360005b83811015620000cd578082015181840152602081019050620000b0565b50505050905090810190601f168015620000fb5780820380516001836020036101000a031916815260200191505b5060405260200180519060200190929190805190602001909291908051906020019092919080519060200190929190805160405193929190846401000000008211156200014757600080fd5b838201915060208201858111156200015e57600080fd5b82518660018202830111640100000000821117156200017c57600080fd5b8083526020830192505050908051906020019080838360005b83811015620001b257808201518184015260208101905062000195565b50505050905090810190601f168015620001e05780820380516001836020036101000a031916815260200191505b506040525050508560009080519060200190620001ff929190620004be565b50846001819055508360028190555033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260048190555081600581905550806007908051906020019062000275929190620004be565b5086600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040518060400160405280600c81526020017f4d616e75666163747572657200000000000000000000000000000000000000008152506006908051906020019062000304929190620004be565b507f2c074291d2f14bd3e60f4187def2a0eaa927f617fa53b7dcb3d494d713342853308787878787600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166007604051808973ffffffffffffffffffffffffffffffffffffffff168152602001806020018881526020018781526020018681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff1681526020018060200183810383528a818151815260200191508051906020019080838360005b83811015620003e7578082015181840152602081019050620003ca565b50505050905090810190601f168015620004155780820380516001836020036101000a031916815260200191505b508381038252848181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156200049b5780601f106200046f576101008083540402835291602001916200049b565b820191906000526020600020905b8154815290600101906020018083116200047d57829003601f168201915b50509a505050505050505050505060405180910390a15050505050505062000574565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282620004f6576000855562000542565b82601f106200051157805160ff191683800117855562000542565b8280016001018555821562000542579182015b828111156200054157825182559160200191906001019062000524565b5b50905062000551919062000555565b5090565b5b808211156200057057600081600090555060010162000556565b5090565b610ede80620005846000396000f3fe608060405234801561001057600080fd5b50600436106100a85760003560e01c80635188ab7b116100715780635188ab7b146102655780635917f1e4146102e85780638da5cb5b1461031657806393e67bff1461034a578063cc7e0b5d146103cd578063fbbf93a0146103eb576100a8565b80628c8920146100ad57806317fc45e214610130578063284106f81461014e5780633b710f8c1461016c578063516dde4314610247575b600080fd5b6100b56104e8565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100f55780820151818401526020810190506100da565b50505050905090810190601f1680156101225780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610138610586565b6040518082815260200191505060405180910390f35b61015661058c565b6040518082815260200191505060405180910390f35b6102456004803603604081101561018257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156101bf57600080fd5b8201836020820111156101d157600080fd5b803590602001918460018302840111640100000000831117156101f357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610592565b005b61024f610795565b6040518082815260200191505060405180910390f35b61026d61079b565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102ad578082015181840152602081019050610292565b50505050905090810190601f1680156102da5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610314600480360360208110156102fe57600080fd5b8101908080359060200190929190505050610839565b005b61031e610bdc565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610352610c02565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610392578082015181840152602081019050610377565b50505050905090810190601f1680156103bf5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6103d5610ca0565b6040518082815260200191505060405180910390f35b6103f3610ca6565b604051808060200185815260200184815260200180602001838103835287818151815260200191508051906020019080838360005b83811015610443578082015181840152602081019050610428565b50505050905090810190601f1680156104705780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156104a957808201518184015260208101905061048e565b50505050905090810190601f1680156104d65780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b60068054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561057e5780601f106105535761010080835404028352916020019161057e565b820191906000526020600020905b81548152906001019060200180831161056157829003601f168201915b505050505081565b60045481565b60015481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610655576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f53656e646572206e6f7420617574686f72697a65642e0000000000000000000081525060200191505060405180910390fd5b81600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600690805190602001906106ac929190610dfd565b507fc515b0a178c8ec286db4b246f1381d81529cbd7940b056b4ed3d96dc5a5c47be600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168242604051808473ffffffffffffffffffffffffffffffffffffffff16815260200180602001838152602001828103825284818151815260200191508051906020019080838360005b8381101561075557808201518184015260208101905061073a565b50505050905090810190601f1680156107825780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a15050565b60025481565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108315780601f1061080657610100808354040283529160200191610831565b820191906000526020600020905b81548152906001019060200180831161081457829003601f168201915b505050505081565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146108fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f53656e646572206e6f7420617574686f72697a65642e0000000000000000000081525060200191505060405180910390fd5b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663be3ecf9d336040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561098557600080fd5b505afa158015610999573d6000803e3d6000fd5b505050506040513d60208110156109af57600080fd5b8101908080519060200190929190505050610a32576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f53656c6c6572206e6f7420617574686f72697a65642e0000000000000000000081525060200191505060405180910390fd5b6009600082815260200190815260200160002060009054906101000a900460ff1615610ac6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4472756720426f7820507572636861736564000000000000000000000000000081525060200191505060405180910390fd5b4260025411610b3d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f447275672068617320657870697265640000000000000000000000000000000081525060200191505060405180910390fd5b6004600081548092919060019003919050555060016009600083815260200190815260200160002060006101000a81548160ff0219169083151502179055507f4e4da260f834110a85f7fdac67a31b8376f20e1a5c23d00dd28e816ed50ae939308242604051808473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a150565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60078054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c985780601f10610c6d57610100808354040283529160200191610c98565b820191906000526020600020905b815481529060010190602001808311610c7b57829003601f168201915b505050505081565b60055481565b6060600080606060006001546002546007838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d4c5780601f10610d2157610100808354040283529160200191610d4c565b820191906000526020600020905b815481529060010190602001808311610d2f57829003601f168201915b50505050509350808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610de85780601f10610dbd57610100808354040283529160200191610de8565b820191906000526020600020905b815481529060010190602001808311610dcb57829003601f168201915b50505050509050935093509350935090919293565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282610e335760008555610e7a565b82601f10610e4c57805160ff1916838001178555610e7a565b82800160010185558215610e7a579182015b82811115610e79578251825591602001919060010190610e5e565b5b509050610e879190610e8b565b5090565b5b80821115610ea4576000816000905550600101610e8c565b509056fea2646970667358221220f04ac3149d5755a4a573e134283e8c174a4e50d63a9f253a239627742198633a64736f6c63430007040033';
    var myContract= new web3.eth.Contract(abi);
    var Lotbatchnew;
    var OriginalSummaryAddress= '0xC04C121C3e1511F83eFBA2DD08B63b2035EFe06d';
    var a = document.getElementById("medicine").value;
    var b = document.getElementById("mdate").value;
    var epocB = moment(b, 'YYYY/MM/DD').unix();
    b = epocB;
    var c = document.getElementById("edate").value;
    var epocC = moment(c, 'YYYY/MM/DD').unix();
    c = epocC;
    var d = document.getElementById("quant").value;
    var e = document.getElementById("price").value;
    var f = this.state.ipfsHash;
    await myContract.deploy({data: bin,arguments:[OriginalSummaryAddress,a,b,c,d,e,f]}).send({
      from: accounts[0]

  })
  .then(function(newContractInstance){
      Lotbatchnew= newContractInstance;
      alert(document.getElementById("demo").innerHTML = "Your contract got deployed successfully at address: "+newContractInstance.options.address);
      console.log(newContractInstance.options.address) // instance with the new contract address
  });
  document.getElementById("image2").src ="https://gateway.ipfs.io/ipfs/"+this.state.ipfsHash;


  //here
  this.setState({myContract:Lotbatchnew});
  this.setState({qrAdd:this.state.myContract.options.address});
  console.log(this.state.qrAdd);
  this.setState({g:true});

const AddToSummary = async (Radd)=> {
        await this.state.SummaryContract.methods.approveDispatched(LBadd).send({from:this.state.account},function(error, transactionHash){   
        console.log(transactionHash);
        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
        if(y!= '')
          alert(document.getElementById("rvm4").innerHTML = y);
        else
          alert(document.getElementById("rvm4").innerHTML = "Dispatched Package is Successfully added to the Original Drug Summary");
        
       };
       
       revertmsg(transactionHash);
      }

)};
 console.log('now try to add to summary');
var LBadd = this.state.myContract.options.address;
AddToSummary(LBadd);
    }; //onSubmit
  
 onClick2 = async (event) => {
    event.preventDefault();
    var LBadd = document.getElementById("LBadd").value;
    var sellerAdd = document.getElementById("sellerA").value;
    var sellerName = document.getElementById("sellerN").value;
    var myContract= new web3.eth.Contract(LBabi,LBadd);
    await myContract.methods.changeOwner(sellerAdd,sellerName).send({from:this.state.account}, function(error, transactionHash){
        
        console.log(transactionHash);
        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
        if(y!= '')
          alert(document.getElementById("rvm1").innerHTML = y);
        else
          alert(document.getElementById("rvm1").innerHTML = "Drug Owner Changed");
        
       };
       
       revertmsg(transactionHash);

  })
  }; //onClick2 for change owner
  state = { showDeploy: true}
  state = { showChangeOwner: true}
  state = { ViewHistory: true}
  render() {
      
    const { showDeploy } = this.state
    const { showChangeOwner } = this.state;
    const { ViewHistory } = this.state;
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
     <b>  Welcome to the Manufacturers page </b>

    </div>
  
      </header>
      <div class="center">  
      
      <div>
            
            { showDeploy && (
                <div id="the div you want to show and hide"> 
                 <br/> 
                <b style={{ color: 'rgb(204, 221, 255)' }}> Please fill in the all the following fields to deploy a Lot Batch Smart Contract</b>
                 
                   
                <div class = "center">
                       <br/>
                     <table style={{ color: 'rgb(255, 255, 255)' }}>
                         <tr>
                             <td > Medicine Name:
                             </td>
                             <td>
                                 <input type="text" id="medicine"  class="mytextS" />
                             </td>
                         </tr>
                          <tr>
                             <td> Manu date:
                             </td>
                             <td>
                                 <input type="date" id="mdate" class="mytextS" />
                             </td>
                         </tr>
                         <tr>
                             <td> Expiry date:
                             </td>
                             <td>
                                 <input type="date" id="edate"  class="mytextS" />
                             </td>
                         </tr>
                          <tr>
                             <td> Quantity:
                             </td>
                             <td>
                                 <input type="text" id="quant"  class="mytextS" />
                             </td>
                         </tr>
                         <tr>
                             <td> Price:
                             </td>
                             <td>
                                 <input type="text"  id="price"  class="mytextS" />
                             </td>
                         </tr>
                     </table>
                     <br/>
                 </div>
                 <b style={{ color: 'rgb(204, 221, 255)' }}> Upload a picture of the Medicine by choosing a file below: </b>
                 <br/>
                 <br/>
                 <form onSubmit={this.onClick}>
                    <input 
                        type = "file"  class="choosefiletext"
                        onChange = {this.captureFile}
                      />
                      <br/>
                      </form>
                       <form  onSubmit={this.onSubmit}>
                       <br/>
          
                       
                  
                       <button  class="button" type="submit">  Deploy Lot Batch </button>
                       <p style={{ color: 'rgb(255, 255, 255)' }} id="demo"></p> 
              
                    </form>
          
                  <img  height="500" width="500" id="image2" />
                  <p style={{ color: 'rgb(255, 255, 255)' }} >{this.state.ipfsHash}</p> 
                  <p  style={{ color: 'rgb(255, 255, 255)' }}  id="rvm4"></p>
                  <h1>{ this.state.g == true ? <QrCode value={this.state.qrAdd} QrCode size = {'400'}/> : '' } </h1> 
                  </div> 

                )}
 <button class="barButtons barButtons1" onClick={() => this.setState({ showDeploy: !showDeploy })}>
                { showDeploy ? 'Cancel' : ' Create Lot Batch' }
            </button>
      </div>  
              
      <br/> 
      <div>
      
            
                { showChangeOwner && (
                    <div class = "center" id="the div you want to show and hide">
                  <form onSubmit={this.onScan}>
                            <br/>
                            <b style={{ color: 'rgb(204, 221, 255)' }}> To change owner: Scan QR code to get Lot Batch Address and fill in other fields.    </b>
                            <br/> 
                            <br/> 
          <button class="button" type="submit"> Read QR Code </button>
          </form>
          {/* <h1>{ this.state.g3 == true ? <QrCode value={this.state.qr3} QrCode size = {'400'}/> : '' } </h1> */}
          <h1> { this.state.qr=== true && this.state.result === '' ? <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "25%" }}
        />  : ''} </h1>




        <p  style={{ color: 'rgb(255, 255, 255)' }} >{this.state.result}</p>

        <form onSubmit={this.onClick2}>
                    
                   <div class = "center">
                     
       
                       <table  style={{ color: 'rgb(255, 255, 255)' }}>
                      <tr>
                             <td> Lot Batch Address:
                             </td>
                             <td>
                             <input type="text" id="LBadd"  class="mytextS" value={this.state.result} onChange={this.handleChange}/>
                             </td>
                         </tr>
                         <tr>
                             <td> Seller Address:
                             </td>
                             <td>
                             <input type="text" id="sellerA"   class="mytextS"/>
                             </td>
                         </tr>
                          <tr>
                             <td> Seller Name:
                             </td>
                             <td>
                             <input type="text" id="sellerN"   class="mytextS"/>
                             </td>
                         </tr>
                     </table>
          
                 </div>
                 <br/>
        
         <button  class="button" type="submit">  Change Owner </button>
         </form>
         <p  style={{ color: 'rgb(255, 255, 255)' }}  id="rvm1"></p> 
   

        </div>
                )}     <button class="barButtons barButtons1" onClick={() => this.setState({ showChangeOwner: !showChangeOwner })}>
                { showChangeOwner ? 'Cancel' : 'Change Medicine Owner' }
            </button>
                      </div>  
    <br/>
  
    { ViewHistory && (
                    <div  id="the div you want to show and hide">
         <br/>
    <b style={{ color: 'rgb(204, 221, 255)' }}> To view medicine history: 1) Click (Read QR Code) to enable camera and scan the medicine barcode. </b> 
                 
                 <br/> <br/>
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


export default Manufacturers;