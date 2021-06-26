// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract BicycleOwnership  {
    address public creatorAdmin;
    enum Status {Pending, Approved, Rejected}

    // Struct to store all bicycle related details
    struct BicycleDetail {
        Status status;
        address currOwner;
    }

    uint public approvedBicycleCount;
    uint public pendingBicycleCount;

    mapping(uint => BicycleDetail) public bicycles; // Stores all bicycles bicycleId -> bicycle Detail
    mapping(uint => address) public bicycleOwnerChange; // Keeps track of bicycle owner bicycleId -> Owner Address
    mapping(address => mapping(uint => bool)) public userBicycles; // Keeps track of all user's bicycles user address -> mapping of bicycleId to bool

    // Modifier to ensure only the bicycle owner access
    modifier onlyOwner(uint _bicycleId) {
        require(bicycles[_bicycleId].currOwner == msg.sender);
        _;
    }

    // Modifier to ensure only the verified admin access a function
    modifier onlyAdmin() {
        require(msg.sender == creatorAdmin);
        _;
    }

    modifier statusPending(uint _bicycleId) {
        require(bicycles[_bicycleId].status == Status.Pending);
        _;
    }

    // Initializing the Contract.
    constructor() public {
        creatorAdmin = msg.sender;
    }

    event CreateBicycle(uint _bicycleId, address _owner);

    /// @dev Function to create bicycle
    /// @param _bicycleId Identifier for bicycle
    /// @param _owner Owner address for bicycle
    function createBicycle(
        uint _bicycleId,
        address _owner
    ) external onlyAdmin returns (bool) {
        bicycles[_bicycleId] = BicycleDetail(Status.Pending, _owner);
        userBicycles[_owner][_bicycleId] = true;
        pendingBicycleCount++;

        emit CreateBicycle(_bicycleId, _owner);
        return true;
    }

    function getBicycle(uint _bicycleId
    ) external onlyOwner(_bicycleId) view returns (BicycleDetail memory) {
        return bicycles[_bicycleId];
    }

    /// @dev Approve bicycle
    /// @param _bicycleId Identifier for bicycle
    function approveBicycle(uint _bicycleId)
        external
        onlyOwner(_bicycleId)
        statusPending(_bicycleId)
        returns (bool)
    {
        bicycles[_bicycleId].status = Status.Approved;
        pendingBicycleCount--;
        approvedBicycleCount++;
        return true;
    }

    /// @dev Function to reject bicycle
    /// @param _bicycleId Identifier for bicycle
    function rejectBicycle(uint _bicycleId)
        external
        onlyOwner(_bicycleId)
        statusPending(_bicycleId)
        returns (bool)
    {
        pendingBicycleCount--;
        bicycles[_bicycleId].status = Status.Rejected;
        userBicycles[msg.sender][_bicycleId] = false;
        return true;
    }

    // /// @dev Function to change bicycle ownership
    // /// @param _bicycleId Identifier for bicycle
    // /// @param _newOwner new Owner address for bicycle
    // function changeOwnership(uint _bicycleId, address _newOwner)
    //     external
    //     onlyOwner(_bicycleId)
    //     returns (bool)
    // {
    //     require(bicycles[_bicycleId].currOwner != _newOwner);
    //     require(bicycleOwnerChange[_bicycleId] == address(0));
    //     bicycleOwnerChange[_bicycleId] = _newOwner;
    //     return true;
    // }

    // /// @dev Function to approve change of ownership
    // /// @param _bicycleId Identifier for bicycle
    // function approveChangeOwnership(uint _bicycleId)
    //     external
    //     returns (bool)
    // {
    //     require(bicycleOwnerChange[_bicycleId] == msg.sender);
    //     bicycles[_bicycleId].currOwner = bicycleOwnerChange[_bicycleId];
    //     bicycleOwnerChange[_bicycleId] = address(0);
    //     return true;
    // }


    // /// @dev Function to change property value
    // /// @param _bicycleId Identifier for property
    // /// @param _newValue New Property Price
    // function changeValue(uint _bicycleId, uint _newValue)
    //     external
    //     onlyOwner(_bicycleId)
    //     returns (bool)
    // {
    //     require(bicycleOwnerChange[_bicycleId] == address(0));
    //     bicycles[_bicycleId].value = _newValue;
    //     return true;
    // }

    // /// @dev Function to create property
    // /// @param _bicycleId Identifier for property
    // function getBicycleDetails(uint _bicycleId)
    //     public
    //     view
    //     returns (
    //         Status,
    //         uint,
    //         address
    //     )
    // {
    //     return (
    //         bicycles[_bicycleId].status,
    //         bicycles[_bicycleId].value,
    //         bicycles[_bicycleId].currOwner
    //     );
    // }

    // address public admin;
    // constructor() public{
    //     admin = msg.sender;
    // }

    // enum Status {NotExist, Pending, Approved, Rejected}

    // // Struct to hold all bicycle related data
    // struct Bicycle {
    //     Status status;
    //     uint value;
    //     address currOwner;
    // }

    //  // Read/write Bicycle
    // mapping(address => Bicycle[]) public bicycles;
    // // mapping(address => mapping(uint => Bicycle)) public bicycles;

    // // Store Bicycle Count
    // uint public bicycleCount;

    // // Create instance of a new
    // function addBike(uint _id, address owner) public {
    //     require(msg.sender == admin, "Only admin can add new bicycles");
    //     Bicycle memory newBicycle = Bicycle(_id);

    //     // bicycles[owner][_id] = newBicycle;
    //     bicycles[owner].push(newBicycle);
    //     bicycleCount++;
    //     emit addbicycleEvent(bicycleCount);
    // }

    // function getBikesOwned()public view returns( Bicycle  [] memory){
    //     return bicycles[msg.sender];
    // }

    // function giveOwnership(uint _id, address giveToAddress) public {
    //     require(msg.sender != giveToAddress, "Cannot give ownership to yourself");


    // }

    // event addbicycleEvent(uint indexed_bicycleId);
}
