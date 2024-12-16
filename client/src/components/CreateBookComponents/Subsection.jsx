import React, { useState } from "react";
import Heading from "./CreateHeading";
import renderComponent from "../functions/renderComponent";
import axios from "axios";
import { ToLink } from "../../App";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const Subsection = ({ value, onChange }) => {
  const [components, setComponents] = useState(value.components || []);
  const [selectedType, setSelectedType] = useState("Text");
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleAddComponent = () => {
    const newComponent = { id: Date.now(), type: selectedType, content: "" };
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    onChange({ ...value, components: updatedComponents });
  };

  const handleComponentChange = async (id, content, type) => {
    let updatedComponents;
    if (type === "Image") {
      const formData = new FormData();
      formData.append("image", content);
      const uploadResponse = await axios.post(`${ToLink}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const profileImageUrl = uploadResponse.data.fileUrl;
      updatedComponents = components.map((component) =>
        component.id === id
          ? { ...component, content: profileImageUrl }
          : component
      );
    } else {
      updatedComponents = components.map((comp) =>
        comp.id === id ? { ...comp, content, type } : comp
      );
    }
    setComponents(updatedComponents);
    onChange({ ...value, components: updatedComponents });
  };

  const handleDeleteComponent = (id) => {
    const updatedComponents = components.filter((comp) => comp.id !== id);
    setComponents(updatedComponents);
    onChange({ ...value, components: updatedComponents });
  };
  const handleTitleChange = (title) => {
    onChange({ ...value, heading: title });
  };
  const handleSummaryChange = (summary) => {
    onChange({ ...value, subsectionsummary: summary });
  };
  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
      {/* Heading Component */}
      <input
        type="text"
        value={value.heading || ""}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Enter Subsection Title"
        className="text-xl font-bold mb-4 p-2 w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <textarea
        value={value.subsectionsummary || ""}
        onChange={(e) => handleSummaryChange(e.target.value)}
        placeholder="Enter Subsection Summary"
        className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
      />

      {/* Render components dynamically */}
      <div className="p-2 mt-4 border rounded-lg bg-white">
        {components.map((comp) => (
          <div
            key={comp.id}
            className="mb-4 border p-2 rounded-lg bg-gray-100 relative"
          >
            {renderComponent(comp, handleComponentChange)}

            {/* Delete Icon */}
            <button
              onClick={() => handleDeleteComponent(comp.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTrash size={18} />
            </button>
          </div>
        ))}

        {/* Component Selector */}
        <div className="flex items-center mt-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="mr-2 p-2 border rounded-lg"
          >
            <option value="Text">Text</option>
            <option value="Heading">Heading</option>
            <option value="Graph">Graph</option>
            <option value="Equation">Equation</option>
            <option value="Quiz">Multiple Choice Quiz</option>
            <option value="FillInTheBlanks">Fill in the Blanks</option>
            <option value="Video">Video</option>
            <option value="Image">Image</option>
          </select>
          <button
            onClick={handleAddComponent}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Component
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subsection;
