import React from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';
import drizzleOptions from './drizzleOptions';
import MyComponent from './MyComponent.jsx';
import './App.css';

const drizzle = new Drizzle(drizzleOptions);

window.ethereum.on('accountsChanged', () => window.location.reload());

const App = () => (
  <DrizzleContext.Provider drizzle={drizzle}>
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return 'Loading...';
        }

        return <MyComponent drizzle={drizzle} drizzleState={drizzleState} />;
      }}
    </DrizzleContext.Consumer>
  </DrizzleContext.Provider>
);
export default App;
