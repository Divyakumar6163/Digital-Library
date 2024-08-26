import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

const EquationEditor = () => {
  const [equation, setEquation] = useState("");
  const [backupEquation, setBackupEquation] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setEquation(e.target.value);
  };

  const togglePreview = () => {
    if (equation.trim() === "") return; // Prevent saving if the input is empty
    setIsPreview(!isPreview);
    if (!isPreview) {
      setBackupEquation(equation); // Save the current equation as a backup before previewing
    }
  };

  const handleEdit = () => {
    setIsPreview(false);
  };

  const handleCancel = () => {
    setEquation(backupEquation); // Restore the equation to its previous state
    setIsPreview(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Equation Editor</h2>
      {!isPreview ? (
        <>
          <div className="mb-4">
            <textarea
              value={equation}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter LaTeX formatted equation..."
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={togglePreview}
              className={`px-4 py-2 text-white rounded-lg ${
                equation.trim() === ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              }`}
              disabled={equation.trim() === ""}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-white px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-200 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Preview:</h3>
            <div className="p-2 border rounded-lg bg-gray-100">
              <BlockMath
                math={equation}
                errorColor={"#cc0000"}
                onError={(err) => setError(err.message)}
              />
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Inline Equation:</h3>
            <div className="p-2 border rounded-lg bg-gray-100">
              <InlineMath math={equation} errorColor={"#cc0000"} />
            </div>
          </div>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EquationEditor;
