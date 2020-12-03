 pragma solidity >=0.4.22;
contract ReturnedDrugsSummary{
    
    address FDA;
    
    mapping(address=>bool) ApprovedResellers;

    mapping(address=>bool) ApprovedCA;
    
    mapping(address=>bool) returnedDrugPackages;
    
    constructor () public{
        FDA=msg.sender;
    }
    
    modifier onlyFDA{
      require(msg.sender == FDA,
      "FDA not authorized."
      );
      _;
    }    
    
    modifier onlyCA{
      require(ApprovedCA[msg.sender],
      "Certification Agency not authorized."
      );
      _;
    }    
    
    function AutoAthuentication() public view returns (string memory usertype) {
        if (msg.sender ==FDA)
            return "FDA";
        if (ApprovedResellers[msg.sender])
            return "Reseller";
        else if (ApprovedCA[msg.sender])
            return "CA";
        else 
            return "None";
    }
    function regiterReseller(address Reseller) public onlyFDA{
        require(!ApprovedResellers[Reseller],
            "Reseller exists already"
            );
            
        ApprovedResellers[Reseller]=true;
    }
    
    function regiterCA(address CA) public onlyFDA{
        require(!ApprovedCA[CA],
            "Certification Agency exists already"
            );
            
        ApprovedCA[CA]=true;
    }
    
    function approveReturnedPackage(address ReturnedPackageEA) public onlyCA {
        returnedDrugPackages[ReturnedPackageEA]=true;
    }
     function ResellerExists(address s) public view returns(bool){
        return ApprovedResellers[s];
    }
    
}