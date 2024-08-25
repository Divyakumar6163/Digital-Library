import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

const EquationEditor = () => {
  const [equation, setEquation] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setEquation(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Equation Editor</h2>
      <div className="mb-4">
        <textarea
          value={equation}
          onChange={handleInputChange}
          rows="4"
          placeholder="Enter LaTeX formatted equation..."
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Preview:</h3>
        <div className="p-2 border rounded-lg bg-gray-100">
          {equation ? (
            <BlockMath
              math={equation}
              errorColor={"#cc0000"}
              onError={(err) => setError(err.message)}
            />
          ) : (
            <p className="text-gray-500">
              Enter an equation to see the preview here.
            </p>
          )}
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Inline Equation:</h3>
        <div className="p-2 border rounded-lg bg-gray-100">
          {equation ? (
            <InlineMath math={equation} errorColor={"#cc0000"} />
          ) : (
            <p className="text-gray-500">
              Enter an equation to see the inline preview here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquationEditor;
