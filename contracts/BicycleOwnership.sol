// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BicycleOwnership  {
    address admin;
    constructor() public {
        admin = msg.sender;
    }

    struct Bicycle {
        uint id;
        // string brand;
        // address owner;
    }

     // Read/write Bicycle
    mapping(uint => Bicycle) public bicycles;

    // Store Bicycle Count
    uint public bicycleCount;



    // Create instance of a new
    function addBike(uint _id) public {
        require(msg.sender == admin, "Only admin can add new bicycles");

        bicycleCount++;
        Bicycle memory bicycle = Bicycle(_id);
        bicycles[_id] = bicycle;

        emit addbicycleEvent(bicycleCount);
    }


    event addbicycleEvent(uint indexed_bicycleId);
}
