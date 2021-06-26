import React, { useEffect, useState } from 'react';
import { newContextComponents } from '@drizzle/react-components';
import { statusName } from './constants.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const { AccountData, ContractData, ContractForm } = newContextComponents;
const BicycleItem = ({ drizzle, drizzleState, bicycleId }) => {
  const { BicycleOwnership } = drizzleState.contracts;
  const contract = drizzle.contracts.BicycleOwnership;

  const [bicycleDataKey, setBicycleDataKey] = useState(null);
  useEffect(() => {
    const dataKey = contract.methods['bicycles'].cacheCall(bicycleId);
    setBicycleDataKey(dataKey);
  }, [bicycleDataKey, contract]);

  const bicycleData = BicycleOwnership.bicycles[bicycleDataKey] && BicycleOwnership.bicycles[bicycleDataKey].value;

  const sendTransaction = (method) => {
    let state = drizzle.store.getState();
    const stackId = contract.methods[method].cacheSend(bicycleId);
    if (state.transactionStack[stackId]) {
      const txHash = state.transactionStack[stackId];
      return state.transactions[txHash].status;
    }
  };

  const renderActionButtons = () => {
    if (statusName[bicycleData.status] === 'Pending') {
      return (
        <>
          <button onClick={() => sendTransaction('approveBicycle')} type="button" className="btn btn-success">
            Approve
          </button>
          <button onClick={() => sendTransaction('rejectBicycle')} type="button" className="btn btn-danger">
            Reject
          </button>
        </>
      );
    }
  };

  if (bicycleData && statusName[bicycleData.status] !== 'Rejected' && bicycleData.currOwner === drizzleState.accounts[0]) {
    return (
      <tr>
        <th scope="row">{bicycleId}</th>
        <td>{statusName[bicycleData.status]}</td>
        <td>{renderActionButtons()}</td>
      </tr>
    );
  }

  return null;
};

const BikesOwned = ({ drizzle, drizzleState }) => {
  const { BicycleOwnership } = drizzleState.contracts;

  const { abi, address} = drizzle.contracts.BicycleOwnership;
  const [instance, setInstance] = useState();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    setInstance(new drizzle.web3.eth.Contract(abi, address))
    instance && instance.getPastEvents("CreateBicycle", { fromBlock: 1}).then(setEvents);
  }, [BicycleOwnership])

  const currAccount = drizzleState.accounts[0];
  const bicycleIds = events.filter(e => e.returnValues._owner === currAccount).map(e => e.returnValues._bicycleId)

  return (
    <div className="section">
      {bicycleIds.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {bicycleIds.map((e) => (
              <BicycleItem drizzle={drizzle} drizzleState={drizzleState} bicycleId={e} key={e} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BikesOwned;
