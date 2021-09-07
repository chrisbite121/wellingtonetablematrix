import * as React from 'react';
import { Chart } from './components/Chart';

export const App: React.FC = (props:any) => {
    return (
      <div className="App">
        <Chart data={props}/>
      </div>
    );
  }