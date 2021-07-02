import React from 'react';
import { newContextComponents } from '@drizzle/react-components';

const contract = 'BicycleOwnership';

const { AccountData, ContractData, ContractForm } = newContextComponents;

const AdminPanel = ({ drizzle, drizzleState }) => (
  <>
    <div className="section">
      <h1>Admin panel</h1>
    </div>

    <div className="section">
      <h3>Bicycles approved:</h3>
      <ContractData drizzle={drizzle} drizzleState={drizzleState} contract={contract} method="approvedBicycleCount" />
      <h3>Bicycles pending:</h3>
      <ContractData drizzle={drizzle} drizzleState={drizzleState} contract={contract} method="pendingBicycleCount" />
      <h3>Add new bike</h3>
      <ContractForm drizzle={drizzle} contract={contract} method="createBicycle" />
    </div>
  </>
);

export default AdminPanel;
