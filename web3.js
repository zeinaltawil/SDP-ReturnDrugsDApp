// import Web3 from 'web3';
// const web3 = new Web3(window.ethereum)
// window.ethereum.enable().catch(error => {
//     // User denied account access
//     console.log(error)
// })
// export default web3;
import Web3 from 'web3';
const web3 = new Web3(window.ethereum)
window.ethereum.enable().catch(error => {
     // User denied account access
    console.log(error)
 })
//from https://coderrocketfuel.com/article/configure-infura-with-web3-js-and-node-js
//const Web3 = require("web3")
//const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/3c6d602314f44696bf34cdc004470a78"))
//import Web3 from 'web3';
//const web3 = new Web3(window.ethereum)
//if (typeof web3 === 'undefined'){
   // console.log('No web3 detected using HTTP provider (infura)')
   // window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/3c6d602314f44696bf34cdc004470a78"));
//}
//else
//{
   // window.web3= new Web3(web3.curretProvider);
   // console.log('Metamask web3 detected!')
   
//}
//window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/3c6d602314f44696bf34cdc004470a78"));

export default web3;