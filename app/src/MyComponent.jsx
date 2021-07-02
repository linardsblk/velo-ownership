import React, { useState, useEffect } from 'react';
import { newContextComponents } from '@drizzle/react-components';
import logo from './logo.png';
import AdminPanel from './AdminPanel.jsx';
import BicyclesOwned from './BicyclesOwned.jsx';
import BicyclePanel from './BicyclePanel.jsx';
import CheckStolen from './CheckStolen.jsx';

const { AccountData, ContractData, ContractForm } = newContextComponents;

const contract = 'BicycleOwnership';

const MyComponent = (props) => {
  const { drizzle, drizzleState } = props;
  const [adminDataKey, setAdminDataKey] = useState(null);
  const [selectedBicycleId, setSelectedBicycleId] = useState(null);

  const { BicycleOwnership } = drizzleState.contracts;

  useEffect(() => {
    const contract = drizzle.contracts.BicycleOwnership;
    const dataKey = contract.methods['creatorAdmin'].cacheCall();
    setAdminDataKey(dataKey);
  }, [adminDataKey, drizzle.contracts.BicycleOwnership]);

  const isAdmin =
    !!BicycleOwnership.creatorAdmin[adminDataKey] &&
    BicycleOwnership.creatorAdmin[adminDataKey].value === drizzleState.accounts[0];

  return (
    <div className="App">
      <div>
        <img src={logo} alt="drizzle-logo" />
      </div>
      <div className="section">
        <h2>Active Account</h2>
        <AccountData {...props} accountIndex={0} units="ether" precision={3} />
      </div>
      {isAdmin && <AdminPanel {...props} />}
      {selectedBicycleId ? (
        <BicyclePanel {...props} selectedBicycleId={selectedBicycleId} setSelectedBicycleId={setSelectedBicycleId} />
      ) : (
        <>
          <CheckStolen {...props} />
          <BicyclesOwned {...props} selectedBicycleId={selectedBicycleId} setSelectedBicycleId={setSelectedBicycleId} />
        </>
      )}
    </div>
  );
};
export default MyComponent;
