import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Subsection from "./Subsection";
import { notify } from "../../store/utils/notify";
import renderComponent from "../functions/renderComponent";
import axios from "axios";
import { ToLink } from "../../App";
import { FaTrash } from "react-icons/fa";
import { socket } from "../../API/socket";
import * as useractions from "../../store/actions/bookactions";
const Section = ({
  bookId,
  chapters,
  chapterId,
  value,
  onChange,
  onDelete,
}) => {
  const curbookdispatch = useDispatch();
  const [subsections, setSubsections] = useState(value.subsections || []);
  const [isSaving, setIsSaving] = useState(false); // State to handle save button status
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [components, setComponents] = useState(value.components || []);
  const [selectedType, setSelectedType] = useState("Text");
  const [localTitle, setLocalTitle] = useState(value.title || "");
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
    setLocalTitle(title);
    socket.emit("update-section-title", {
      chapterId,
      bookId,
      sectionId: value.id,
      title,
      chapters,
    });
    onChange({ ...value, title });
  };
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
  const handleSaveSection = () => {
    setIsSaving(true); // Show saving status
    // Simulate save operation (e.g., API call)
    setTimeout(() => {
      console.log("Section saved:", { ...value, subsections });
      setIsSaving(false); // Reset saving status
    }, 1000);
    notify("Section saved successfully");
  };
  useEffect(() => {
    setLocalTitle(value.title || "");
  }, [value.id, value.title]);

  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50">
      {/* Editable Section Heading */}
      <input
        type="text"
        value={localTitle}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Enter Section Title"
        className="text-xl font-bold mb-4 p-2 w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
      />
      {/* <textarea
        value={value.sectionsummary || ""}
        onChange={(e) => handleSummaryChange(e.target.value)}
        placeholder="Enter Section Summary"
        className="text-md mb-4 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
      /> */}
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
            {/* <option value="Heading">Heading</option> */}
            <option value="Graph">Graph</option>
            <option value="Equation">Equation</option>
            <option value="Quiz">Multiple Choice Quiz</option>
            <option value="FillInTheBlanks">Fill in the Blanks</option>
            {/* <option value="Video">Video</option> */}
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
