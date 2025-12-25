import React from 'react';
import { lusolve, matrix } from 'mathjs';

function solveMatrix(m) {
  const a = m.map(row => row.slice(0, -1));
  const b = m.map(row => row[row.length - 1]);
  const A = matrix(a);
  const B = matrix(b);
  const solution = lusolve(A, B);
  return solution.toArray().map(row => row[0]);
}

function findLength(p1, p2) {
  return Math.sqrt(Math.abs(p1[0] - p2[0]) ** 2 + Math.abs(p1[1] - p2[1]) ** 2);
}

function momentCalculation(momentPoint, loadPoint, fx, fy, M, points) {
  const d_x = points[loadPoint][0] - points[momentPoint][0];
  const d_y = points[loadPoint][1] - points[momentPoint][1];
  return M + fy * d_x - fx * d_y;
}

function Graph({ points, parts, point_loads, x_supports, y_supports }) {
  if (x_supports.length + y_supports.length > 3) {
    throw new Error("Too many supports");
  }

  const part_lengths = parts.map(([p1, p2]) => findLength(points[p1], points[p2]));
  const momentPoint = x_supports.length > 0 ? x_supports[0] : y_supports[0];
  const matrix = [
    [0, 0, 0, 0],  // sum Fx
    [0, 0, 0, 0],  // sum Fy
    [0, 0, 0, 0],  // sum M0
  ];

  for (const [p, [fx, fy, M]] of Object.entries(point_loads)) {
    matrix[0][3] += fx;
    matrix[1][3] += fy;
    matrix[2][3] += momentCalculation(momentPoint, parseInt(p), fx, fy, M, points);
  }

  x_supports.forEach((p, i) => {
    matrix[0][i] = 1; // x support
  });

  y_supports.forEach((p, i) => {
    matrix[1][i + x_supports.length] = 1; // y support
  });

  Array.from(new Set([...x_supports, ...y_supports])).forEach((p, i) => {
    if (momentPoint === p) {
      return;
    }
    if (x_supports.includes(p)) {
      matrix[2][i] = points[p][1] - points[momentPoint][1]; // moment arm for x support
    }
    if (y_supports.includes(p)) {
      matrix[2][i] = points[p][0] - points[momentPoint][0]; // moment arm for y support
    }
  });

  console.log("Matrix:", matrix);
  const solutions = solveMatrix(matrix);
  console.log("Solutions:", solutions);

  const minX = Math.min(...points.map(p => p[0]));
  const maxX = Math.max(...points.map(p => p[0]));
  const minY = Math.min(...points.map(p => p[1]));
  const maxY = Math.max(...points.map(p => p[1]));
  const padding = 200;
  const viewBox = `${minX - padding} ${-(maxY + padding)} ${maxX - minX + 2 * padding} ${maxY - minY + 2 * padding}`;

  return (
    <div className="w-full h-full overflow-hidden bg-gray-400">
      <svg className="w-full h-full block" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        {parts.map((part, index) => {
          return (
            <line key={index} x1={points[part[0]][0]} y1={-points[part[0]][1]} x2={points[part[1]][0]} y2={-points[part[1]][1]} stroke="black" strokeWidth="2" />
          )
        })}

        {points.map((point, index) => {
          return (
            <React.Fragment key={index}>
              <circle cx={point[0]} cy={-point[1]} r="5" fill="red" />
              <text x={point[0] + 10} y={-point[1]} fill="yellow" className='font-bold text-3xl'>{index}</text>
            </React.Fragment>
          )
        })}
        {x_supports.map((p, i) => {
          return (
            <text key={i} x={points[p][0]} y={-points[p][1] - 20} fill="blue" className='font-bold text-3xl'>Fx: {solutions[i].toFixed(2)}</text>
          )
        })}
        {y_supports.map((p, i) => {
          return (
            <text key={i} x={points[p][0]} y={-points[p][1] - 40} fill="blue" className='font-bold text-3xl'>Fy: {solutions[i + x_supports.length].toFixed(2)}</text>
          )
        })}
      </svg>
    </div>
  );
}

export default Graph;
