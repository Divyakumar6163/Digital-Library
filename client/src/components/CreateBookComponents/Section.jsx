import React, { useState } from "react";
import Subsection from "./Subsection";

const Section = ({ value, onChange, onDelete }) => {
  const [subsections, setSubsections] = useState(value.subsections || []);

  const handleAddSubsection = () => {
    const newSubsection = {
      id: Date.now(),
      heading: "",
      components: [],
    };
    const updatedSubsections = [...subsections, newSubsection];
    setSubsections(updatedSubsections);
    onChange({ ...value, subsections: updatedSubsections });
  };

  const handleUpdateSubsection = (id, updatedSubsection) => {
    const updatedSubsections = subsections.map((subsec) =>
      subsec.id === id ? updatedSubsection : subsec
    );
    setSubsections(updatedSubsections);
    onChange({ ...value, subsections: updatedSubsections });
  };

  const handleDeleteSubsection = (id) => {
    const updatedSubsections = subsections.filter((subsec) => subsec.id !== id);
    setSubsections(updatedSubsections);
    onChange({ ...value, subsections: updatedSubsections });
  };
  console.log(subsections);
  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Section: {value.title}</h2>

      {/* Render Subsections */}
      {subsections.map((subsec) => (
        <div key={subsec.id} className="mb-4">
          <Subsection
            value={subsec}
            onChange={(updatedSubsection) =>
              handleUpdateSubsection(subsec.id, updatedSubsection)
            }
          />
          <button
            onClick={() => handleDeleteSubsection(subsec.id)}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Delete Subsection
          </button>
        </div>
      ))}

      {/* Add Subsection Button */}
      <button
        onClick={handleAddSubsection}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Add Subsection
      </button>

      {/* Delete Section Button */}
      <button
        onClick={onDelete}
        className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Delete Section
      </button>
    </div>
  );
};

export default Section;
