import React, { Component } from 'react';
import logo from './logo.svg';
import logo2 from './logo2.svg';
import './App.css';
import web3 from './web3';
import { Button } from 'reactstrap';
import IPFS from './ipfs';
import ReactDOM from "react-dom";
import QrCode from 'react.qrcode.generator';
import QrReader from "react-qr-reader";
import RPabi from "./RPabi.json";
//var qcode = "Hello world";
class App1 extends Component {
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
    delay: 300,
    result: ''
  };
   this.handleScan = this.handleScan.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
     this.setState({qr:true});
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
  var bin= '0x608060405234801561001057600080fd5b50604051610ca9380380610ca9833981810160405260c081101561003357600080fd5b810190808051604051939291908464010000000082111561005357600080fd5b8382019150602082018581111561006957600080fd5b825186600182028301116401000000008211171561008657600080fd5b8083526020830192505050908051906020019080838360005b838110156100ba57808201518184015260208101905061009f565b50505050905090810190601f1680156100e75780820380516001836020036101000a031916815260200191505b506040526020018051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190505050856000908051906020019061013992919061035b565b50846004819055508360058190555033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600381905550816001819055506040518060400160405280600281526020017f4341000000000000000000000000000000000000000000000000000000000000815250600690805190602001906101e292919061035b565b5080600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507ffc5e562d9a8977111f043f2d493fcd233d0aec773b883dd1eab1fceecb900350306000600354600154600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808673ffffffffffffffffffffffffffffffffffffffff168152602001806020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182810382528681815460018160011615610100020316600290048152602001915080546001816001161561010002031660029004801561033e5780601f106103135761010080835404028352916020019161033e565b820191906000526020600020905b81548152906001019060200180831161032157829003601f168201915b5050965050505050505060405180910390a15050505050506103f8565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061039c57805160ff19168380011785556103ca565b828001600101855582156103ca579182015b828111156103c95782518255916020019190600101906103ae565b5b5090506103d791906103db565b5090565b5b808211156103f45760008160009055506001016103dc565b5090565b6108a2806104076000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80637d307307116100665780637d307307146101755780638da5cb5b146101a3578063c74d97cd146101d7578063cc7e0b5d1461020b578063faec4db41461022957610093565b806317fc45e214610098578063284106f8146100b6578063516dde43146100d45780635188ab7b146100f2575b600080fd5b6100a06102e4565b6040518082815260200191505060405180910390f35b6100be6102ea565b6040518082815260200191505060405180910390f35b6100dc6102f0565b6040518082815260200191505060405180910390f35b6100fa6102f6565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561013a57808201518184015260208101905061011f565b50505050905090810190601f1680156101675780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101a16004803603602081101561018b57600080fd5b8101908080359060200190929190505050610394565b005b6101ab610637565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101df61065d565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610213610683565b6040518082815260200191505060405180910390f35b6102e26004803603602081101561023f57600080fd5b810190808035906020019064010000000081111561025c57600080fd5b82018360208201111561026e57600080fd5b8035906020019184600183028401116401000000008311171561029057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610689565b005b60035481565b60045481565b60055481565b60008054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561038c5780601f106103615761010080835404028352916020019161038c565b820191906000526020600020905b81548152906001019060200180831161036f57829003601f168201915b505050505081565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610457576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f53656e646572206e6f7420617574686f72697a65642e0000000000000000000081525060200191505060405180910390fd5b6008600082815260200190815260200160002060009054906101000a900460ff16156104eb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f4472756720426f78205265736f6c64000000000000000000000000000000000081525060200191505060405180910390fd5b4260055411610562576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f447275672068617320657870697265640000000000000000000000000000000081525060200191505060405180910390fd5b6105a06040518060400160405280600781526020017f50617469656e7400000000000000000000000000000000000000000000000000815250610689565b6003600081548092919060019003919050555060016008600083815260200190815260200160002060006101000a81548160ff0219169083151502179055507fda9b3f90988de47f2eb5997479c050aa013bcae7c236940a8b6064c7de6c74813082604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461074c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f53656e646572206e6f7420617574686f72697a65642e0000000000000000000081525060200191505060405180910390fd5b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507fabda1e214f112a7ea7b513d5098fa6fd85acae1fcc6ed872c90bcef6c68c9d2c600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682604051808373ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561082e578082015181840152602081019050610813565b50505050905090810190601f16801561085b5780820380516001836020036101000a031916815260200191505b50935050505060405180910390a15056fea2646970667358221220e934028cf4fdcbad8c8a9a6e0167fd6883936d305e276c28ee8e6b5a3c80671664736f6c634300060c0033';
    var myContract= new web3.eth.Contract(abi);
    var ReturnedPackagenew;//Lotbatchnew
    var a = document.getElementById("medicine").value;
    var b = document.getElementById("mdate").value;
    var c = document.getElementById("edate").value;
    var d = document.getElementById("quant").value;
    var e = document.getElementById("price").value;
    var f = document.getElementById("resadd").value;
    
    //myContract.options.data= bin;
    await myContract.deploy({data: bin,arguments:[a,b,c,d,e,f]}).send({
      from: accounts[0]
  })
  .then(function(newContractInstance){
      ReturnedPackagenew= newContractInstance;
      document.getElementById("demo").innerHTML = "Your contract got deployed successfully at address: "+newContractInstance.options.address;
      console.log(newContractInstance.options.address) // instance with the new contract address
  });
  document.getElementById("image2").src ="https://gateway.ipfs.io/ipfs/"+this.state.ipfsHash;

 


  //here
  this.setState({myContract:ReturnedPackagenew});
    }; //onSubmit
  onResell = async (event) =>{
    event.preventDefault();
    var resellQ= document.getElementById("resellQ").value;
    var resellAdd = document.getElementById("resellAdd").value;
    var contractnew= new web3.eth.Contract(RPabi,resellAdd);
    var account= this.state.account;
    await contractnew.methods.resellDrug(resellQ).send({from:account}, function(error, transactionHash){
        
        console.log(transactionHash);
        const revertmsg = async() => {
        const getRevertReason = require('eth-revert-reason');
        var y = await getRevertReason(transactionHash,'ropsten');
        console.log(y);
        if(y!= '')
        document.getElementById("rvm1").innerHTML = y;
        else
          document.getElementById("rvm1").innerHTML = "Drug Resold Successfully";
        
       };
       
       revertmsg(transactionHash);

  })
  };
  render() {return (
    <div className="App" >
      <header className="App-header">

       <img src={logo} className="App-logo" alt="logo" id="image1" />
       <img src={logo2} className="App-logo2" alt="logo2" id="image3" />
        <p>
          Edit <code>src/App1.js</code> and save to reload.
        </p>
        <a
        >
           Your Ethereum Address is {this.state.account}
        </a>
      </header>
      

    
           Medicine Name: <input type="text" id="medicine"/>
          <br/>
          Manu date: <input type="text" id="mdate" />
          <br/>
          Expiry date: <input type="text" id="edate" />
          <br />
          Quantity: <input type="text" id="quant" />
          <br />
          Price: <input type="text" id="price" />
          <br />
          Reseller Address: <input type="text" id="resadd" />
          <br />

          <form onSubmit={this.onClick}>
          <input 
              type = "file"
              onChange = {this.captureFile}
            />
             <form onSubmit={this.onSubmit}>
             <Button  bsstyle="primary" type="submit">  Deploy Returned Package </Button>
             <p id="demo"></p>
          </form>
          </form>
            <form onSubmit={this.onResell}>
            Medicine Quantity: <input type = "text" id="resellQ"/>
            Medicine EA:<input type = "text" id="resellAdd" value={this.state.result} onChange={this.handleChange} />
             <Button  type="submit">  Resell Drug </Button>
          </form>
          <p id="rvm1"></p> 
          <form onSubmit={this.onScan}>
          <Button  bsstyle="primary" type="submit"> Read QR Code </Button>
          </form>
          <h1> { this.state.qr== true && this.state.result == '' ? <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "25%" }}
        />  : ''} </h1>
        <p>{this.state.result}</p>
        <img  height="500" width="500" id="image2" />

    </div>
    
  );// return
  }// render()

}// App

export default App1;
