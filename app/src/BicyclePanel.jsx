import React, { useState } from 'react';

const BicyclePanel = (props) => {
  const { drizzle, drizzleState, selectedBicycleId, setSelectedBicycleId } = props;
  const contract = drizzle.contracts.BicycleOwnership;

  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [price, setPrice] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    let state = drizzle.store.getState();
    const stackId = contract.methods.changeOwnership.cacheSend(selectedBicycleId, newOwnerAddress, price);
    if (state.transactionStack[stackId]) {
      const txHash = state.transactionStack[stackId];
      return state.transactions[txHash].status;
    }
    setSelectedBicycleId(null);
  };
  return (
    <div className="section">
      <h1>{`Bicycle ID: ${selectedBicycleId}`}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newOwner">New owner</label>
          <input
            type="text"
            className="form-control"
            id="newOwner"
            placeholder="0x..."
            value={newOwnerAddress}
            onChange={(e) => setNewOwnerAddress(e.target.value)}
          />

          <label htmlFor="price">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BicyclePanel;
