 pragma solidity >=0.4.22;
contract Lot_Batch{
    //address BatchEA;
    string public drugName;
    uint public manufacturingDate;
    uint public expiryDate;
    address public owner;
    uint public quantity;
    uint public pricePerBox;
    string public currentType;
    string public IPFSHash;
    OriginalDrugsSummary summaryContract;

    
    modifier onlySeller{
      require(summaryContract.sellerExists(msg.sender),
      "Seller not authorized."
      );
      _;
    } 
    
    mapping (uint=>bool) drugPurchased;
    
    modifier onlyOwner{
      require(msg.sender == owner,
      "Sender not authorized."
      );
      _;
    }    
    
    event LotDispatched(address LotAddress, string DrugName, uint manufacturingDate, uint expiryDate, uint Quantity, uint PricePerBox, address Manufacturer, string IPFS);
    
    event OwnerChanged(address NewOwner, string OwnerType, uint time);

    event DrugSold(address LotAddress, uint boxNumber, uint time);
    
    constructor(address original, string memory n, uint mDate, uint eDate, uint Q, uint price, string memory IPFS) public{
       drugName=n;
       manufacturingDate = mDate;
       expiryDate= eDate;
       owner= msg.sender;
       quantity= Q;
       pricePerBox= price;
       IPFSHash = IPFS;
       summaryContract = OriginalDrugsSummary(original);
       currentType = "Manufacturer";
       emit LotDispatched(address(this), n, mDate,eDate, Q, price, owner, IPFSHash);
   }
   
  
    function sellDrug(uint boxNumber) public onlyOwner onlySeller{
       require(!drugPurchased[boxNumber],
        "Drug Box Purchased"
        );
        require(expiryDate>now,
        "Drug has expired"
        );
        quantity--;
        drugPurchased[boxNumber]=true;
        emit DrugSold(address(this), boxNumber, now);
   }
  
   function changeOwner(address payable newOwner, string memory OT) public onlyOwner{
       owner=newOwner;
       currentType = OT;
       emit OwnerChanged(owner, OT, now);
   }
   function getDetails() public view returns (string memory name, uint mDate, uint eDate, string memory IPFS){
       return(drugName, manufacturingDate,  expiryDate,  IPFSHash);
   }
   
}