import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Graph from './Graph';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Main() {
  let [points, setPoints] = useState([
    [0, 0],  // 0
    [350, 0],  // 1
    [1125, 1300],  // 2
    [0, 950],  // 3
  ], () => { });

  let [parts, setParts] = useState([
    [0, 1],
    [0, 2],
    [2, 3],
    [0, 3],
    [1, 3],
  ], () => { });

  let [point_loads, setPointLoads] = useState({ 2: [0, -700, 0], }, () => { });
  let [x_supports, setXSupports] = useState([0,], () => { });
  let [y_supports, setYSupports] = useState([0, 1], () => { });

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="overflow-hidden">
        <Graph points={points} parts={parts} point_loads={point_loads} x_supports={x_supports} y_supports={y_supports} />
      </div>
      <div>
        a
      </div>
    </div>
  )
}

root.render(<Main />);
