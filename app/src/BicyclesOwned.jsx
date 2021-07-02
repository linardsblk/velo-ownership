import React, { useEffect, useState } from 'react';
import { uniq } from 'lodash';
import { newContextComponents } from '@drizzle/react-components';
import { statusName } from './constants.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const { AccountData, ContractData, ContractForm } = newContextComponents;
const BicycleItem = ({ drizzle, drizzleState, bicycleId, setSelectedBicycleId }) => {
  const { BicycleOwnership } = drizzleState.contracts;
  const contract = drizzle.contracts.BicycleOwnership;

  const [bicycleDataKey, setBicycleDataKey] = useState(null);
  useEffect(() => {
    const dataKey = contract.methods['bicycles'].cacheCall(bicycleId);
    setBicycleDataKey(dataKey);
  }, [bicycleDataKey, contract]);

  const bicycleData = BicycleOwnership.bicycles[bicycleDataKey] && BicycleOwnership.bicycles[bicycleDataKey].value;

  const [bicycleOwnerChangeKey, setBicycleOwnerChangeKey] = useState(null);
  useEffect(() => {
    const dataKey = contract.methods['bicycleOwnerChange'].cacheCall(bicycleId);
    setBicycleOwnerChangeKey(dataKey);
  }, [bicycleOwnerChangeKey, contract]);

  const bicycleOwnerChangeData =
    BicycleOwnership.bicycleOwnerChange[bicycleOwnerChangeKey] &&
    BicycleOwnership.bicycleOwnerChange[bicycleOwnerChangeKey].value;

  const sendTransaction = (method) => {
    contract.methods[method].cacheSend(bicycleId);
  };

  const { newOwner, price } = bicycleOwnerChangeData || {};

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
    if (statusName[bicycleData.status] === 'Approved') {
      return (
        <button onClick={() => setSelectedBicycleId(bicycleId)} type="button" className="btn btn-primary">
          Details
        </button>
      );
    }
    if (statusName[bicycleData.status] === 'Transfering') {
      if (newOwner === drizzleState.accounts[0]) {
        return (
          <>
            <button onClick={() => sendTransaction('approveChangeOwnership')} type="button" className="btn btn-success">
              Approve
            </button>
            <button onClick={() => sendTransaction('cancelChangeOwnership')} type="button" className="btn btn-danger">
              Reject
            </button>
          </>
        );
      }
      return (
        <button onClick={() => sendTransaction('cancelChangeOwnership')} type="button" className="btn btn-danger">
          Cancel
        </button>
      );
    }
  };

  if (
    (bicycleData &&
      statusName[bicycleData.status] !== 'Rejected' &&
      bicycleData.currOwner === drizzleState.accounts[0]) ||
    (newOwner && newOwner === drizzleState.accounts[0] && statusName[bicycleData.status] === 'Transfering')
  ) {
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

const BikesOwned = (props) => {
  const { drizzle, drizzleState } = props;
  const { BicycleOwnership } = drizzleState.contracts;

  const { abi, address } = drizzle.contracts.BicycleOwnership || {};
  const [instance, setInstance] = useState();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    setInstance(new drizzle.web3.eth.Contract(abi, address));
    instance && instance.getPastEvents('BicyclesRelated', { fromBlock: 1 }).then(setEvents);
  }, [BicycleOwnership]);

  const currAccount = drizzleState.accounts[0];
  const bicycleIds = uniq(
    events.filter((e) => e.returnValues._address === currAccount).map((e) => e.returnValues._bicycleId)
  );

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
              <BicycleItem {...props} bicycleId={e} key={e} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BikesOwned;
