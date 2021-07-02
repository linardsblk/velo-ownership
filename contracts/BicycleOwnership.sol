// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract BicycleOwnership  {
    address public creatorAdmin;
    enum Status {Pending, Approved, Rejected, Transfering}

    // Struct to store all bicycle related details
    struct BicycleDetail {
        Status status;
        address payable currOwner;
        bool stolen;
    }

    struct OwnerChange {
        address payable newOwner;
        uint price;
    }

    uint public approvedBicycleCount;
    uint public pendingBicycleCount;

    mapping(uint => BicycleDetail) public bicycles; // Stores all bicycles bicycleId -> bicycle Detail
    mapping(uint => OwnerChange) public bicycleOwnerChange; // Keeps track of bicycle owner bicycleId -> Owner Address

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

    event BicyclesRelated(uint _bicycleId, address payable _address);

    /// @dev Function to create bicycle
    /// @param _bicycleId Identifier for bicycle
    /// @param _owner Owner address for bicycle
    function createBicycle(
        uint _bicycleId,
        address payable _owner
    ) external onlyAdmin returns (bool) {
        bicycles[_bicycleId] = BicycleDetail(Status.Pending, _owner, false);
        pendingBicycleCount++;

        emit BicyclesRelated(_bicycleId, _owner);
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
        return true;
    }

    // /// @dev Function to change bicycle ownership
    // /// @param _bicycleId Identifier for bicycle
    // /// @param _newOwner new Owner address for bicycle
    function changeOwnership(uint _bicycleId, address payable _newOwner, uint _price)
        external
        onlyOwner(_bicycleId)
        returns (bool)
    {
        require(bicycles[_bicycleId].currOwner != _newOwner);
        require(bicycleOwnerChange[_bicycleId].newOwner == address(0));
        bicycles[_bicycleId].status = Status.Transfering;
        bicycleOwnerChange[_bicycleId].newOwner = _newOwner;
        bicycleOwnerChange[_bicycleId].price = _price;

        emit BicyclesRelated(_bicycleId, _newOwner);
        return true;
    }

    /// @dev Function to approve change of ownership
    /// @param _bicycleId Identifier for bicycle
    function approveChangeOwnership(uint _bicycleId)
        external
    {
        require(bicycleOwnerChange[_bicycleId].newOwner == msg.sender);
        address payable receiver = bicycles[_bicycleId].currOwner;
        uint price = bicycleOwnerChange[_bicycleId].price;
        bicycles[_bicycleId].currOwner = bicycleOwnerChange[_bicycleId].newOwner;
        bicycles[_bicycleId].status = Status.Approved;
        bicycleOwnerChange[_bicycleId].newOwner = address(0);
        bicycleOwnerChange[_bicycleId].price = 0;
        receiver.transfer(price);
    }

    /// @dev Function to reject bicycle
    /// @param _bicycleId Identifier for bicycle
    function cancelChangeOwnership(uint _bicycleId)
        external
        returns (bool)
    {
        require(bicycleOwnerChange[_bicycleId].newOwner == msg.sender || bicycles[_bicycleId].currOwner == msg.sender);
        bicycles[_bicycleId].status = Status.Approved;
        bicycleOwnerChange[_bicycleId].newOwner = address(0);
        bicycleOwnerChange[_bicycleId].price = 0;
        return true;
    }

    /// @dev Reports bicycle as stolen
    /// @param _bicycleId Identifier for bicycle
    function reportBicycleStolen(uint _bicycleId)
        external
        onlyOwner(_bicycleId)
        returns (bool)
    {
        bicycles[_bicycleId].stolen = true;
        return true;
    }

    /// @dev Unreports bicycle as stolen
    /// @param _bicycleId Identifier for bicycle
    function unreportBicycleStolen(uint _bicycleId)
        external
        onlyOwner(_bicycleId)
        returns (bool)
    {
        bicycles[_bicycleId].stolen = false;
        return true;
    }

    function checkIfStolen(uint _bicycleId)
        external
        returns (bool)
    {
        return bicycles[_bicycleId].stolen;
    }


}
