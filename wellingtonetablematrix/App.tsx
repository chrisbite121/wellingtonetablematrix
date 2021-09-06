import * as React from 'react';
import { useState, useEffect } from 'react';
import { Chart } from './components/Chart';

export const App: React.FC = (props:any) => {
    // const [data, setData] = useState({});
  
    // useEffect(() => {
    //   const _config = config();
    //   const data = processData(generateDummyData(), _config);
    //   setData(data);
    // },[])
  
    return (
      <div className="App">
        <Chart data={props}/>
      </div>
    );
  }