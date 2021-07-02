import React, { useState, useEffect } from 'react';

const CheckStolen = (props) => {
  const { drizzle, drizzleState } = props;
  const { BicycleOwnership } = drizzleState.contracts;

  const contract = drizzle.contracts.BicycleOwnership;

  const [bicycleId, setBicycleId] = useState('');

  const [submitedBicycleId, setSubmitedBicycleId] = useState('');
  const [bicycleDataKey, setBicycleDataKey] = useState(null);
  useEffect(() => {
    const dataKey = contract.methods['bicycles'].cacheCall(bicycleId);
    setBicycleDataKey(dataKey);
  }, [submitedBicycleId, bicycleDataKey, contract]);

  const bicycleData = BicycleOwnership.bicycles[bicycleDataKey] && BicycleOwnership.bicycles[bicycleDataKey].value;

  return (
    <div className="section">
      <h2>Check if bicycle is stolen:</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitedBicycleId(bicycleId);
        }}
      >
        <div className="form-group">
          <label htmlFor="bicycleId">Bicycle ID</label>
          <input
            type="text"
            className="form-control"
            id="bicycleId"
            value={bicycleId}
            onChange={(e) => setBicycleId(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>

        {submitedBicycleId && bicycleData && <h2>{bicycleData.stolen ? 'Stolen' : 'Not stolen'}</h2>}
      </form>
    </div>
  );
};

export default CheckStolen;
