import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const GraphPlotter = () => {
  const [labels, setLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [inputLabel, setInputLabel] = useState("");
  const [inputDataPoint, setInputDataPoint] = useState("");

  const addDataPoint = () => {
    setLabels([...labels, inputLabel]);
    setDataPoints([...dataPoints, parseFloat(inputDataPoint)]);
    setInputLabel("");
    setInputDataPoint("");
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "User Data",
        data: dataPoints,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Plot a Graph</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Label"
          value={inputLabel}
          onChange={(e) => setInputLabel(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="number"
          placeholder="Data Point"
          value={inputDataPoint}
          onChange={(e) => setInputDataPoint(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addDataPoint}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Data Point
        </button>
      </div>
      <Line data={data} />
    </div>
  );
};

export default GraphPlotter;
