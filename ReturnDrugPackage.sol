 pragma solidity >=0.4.22;
contract ReturnedPackage{
    
    //address EA;
    string public drugName;
    uint public pricePerBox;
    address public owner;
    uint public quantity;
    uint public manufacturingDate;
    uint public expiryDate;
    string currentType;
    address public reseller; // delete this 
    ReturnedDrugsSummary summaryContract;
    address public BatchEA;
    string public IPFSHash;
    mapping (uint=>bool) drugResold;
    
   modifier onlyOwner{
      require(msg.sender == owner,
      "Owner not authorized."
      );
      _;
    }
    
    modifier onlyReseller{
      require(summaryContract.ResellerExists(msg.sender),
      "Reseller not authorized."
      );
      _;
    }

    event ReturnedDrugApproved(address DrugPackageAddress, string DrugName, uint Quantity, uint PricePerBox, address CertificationAgency, uint time);

    event OwnerChanged(address NewOwner, string OwnerType, uint time);
    

    event DrugResold(address DrugPackageAddress, uint boxNumber, uint time);

    constructor(address returnsum,string memory name, uint mDate, uint eDate, uint Q, uint price,  address LotEA, string memory IPFS) public{
       drugName = name;
       manufacturingDate = mDate;
       expiryDate= eDate;
       owner= msg.sender;
       quantity= Q;
       pricePerBox= price;
       currentType = "CA";
       IPFSHash = IPFS;
       BatchEA = LotEA;
       summaryContract = ReturnedDrugsSummary(returnsum);
       //reseller=reselleradd;
       emit ReturnedDrugApproved(address(this), drugName, quantity, pricePerBox, owner, now);
   }
 
    function changeOwner(address payable newOwner, string memory OT) public onlyOwner{
       owner=newOwner;
       emit OwnerChanged(owner, OT, now);
   }
   function resellDrug(uint boxNumber) public onlyOwner onlyReseller{
       require(!drugResold[boxNumber],
        "Drug Box Resold"
        );
        require(expiryDate>now,
        "Drug has expired"
        );
        //changeOwner("Patient");
        quantity--;
        drugResold[boxNumber]=true;
        emit DrugResold(address(this), boxNumber, now);
   }
   function getDetails() public view returns (string memory name, uint mDate, uint eDate, uint Q, uint price, address reselleradd, address LotEA, string memory IPFS){
       return(drugName, manufacturingDate,  expiryDate,  quantity, pricePerBox,  reseller,  BatchEA,  IPFSHash);
   }
}