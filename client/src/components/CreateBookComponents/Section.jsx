import React, { useState } from "react";
import Subsection from "./Subsection";
import { notify } from "../../store/utils/notify";

const Section = ({ value, onChange, onDelete, saveChapter }) => {
  const [subsections, setSubsections] = useState(value.subsections || []);
  const [isSaving, setIsSaving] = useState(false); // State to handle save button status

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

  const handleTitleChange = (title) => {
    onChange({ ...value, title });
  };

  const handleSaveSection = () => {
    setIsSaving(true); // Show saving status
    // Simulate save operation (e.g., API call)
    setTimeout(() => {
      console.log("Section saved:", { ...value, subsections });
      setIsSaving(false); // Reset saving status
    }, 1000);
    notify("Section saved successfully");
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50">
      {/* Editable Section Heading */}
      <input
        type="text"
        value={value.title || ""}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Enter Section Title"
        className="text-xl font-bold mb-4 p-2 w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
      />

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
        className="w-full mb-4 bg-gray-200 p-2 rounded-lg"
      >
        +Add Subsection
      </button>

      {/* Buttons Container */}
      <div className="flex justify-between mb-4 space-x-2">
        {/* Delete Section Button */}
        <button
          onClick={onDelete}
          className="w-1/2 bg-red-500 p-2 rounded-lg text-white"
        >
          Delete Section
        </button>

        {/* Save Section Button */}
        <button
          onClick={handleSaveSection}
          className={`w-1/2 bg-blue-500 p-2 rounded-lg ${
            isSaving ? "bg-gray-500" : "bg-blue-500 text-white"
          }`}
          disabled={isSaving} // Disable button while saving
        >
          {isSaving ? "Saving..." : "Save Section"}
        </button>
      </div>
    </div>
  );
};

export default Section;
