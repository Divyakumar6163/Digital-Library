import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing the icons
import CreateMCQ from "./CreateMCQ";
import CreateFIB from "./CreateFIB";

const CreateBookStore = () => {
  const [chapters, setChapters] = useState([]);
  const [showFormOptions, setShowFormOptions] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);

  const addNewChapter = () => {
    const newChapter = `Chapter ${chapters.length + 1}`;
    setChapters([...chapters, newChapter]);
  };

  const toggleFormOptions = () => {
    setShowFormOptions(!showFormOptions);
  };

  const handleFormOptionClick = (option) => {
    setSelectedComponents([
      ...selectedComponents,
      { type: option, id: Date.now() },
    ]);
  };

  const editComponent = (id) => {
    const editedComponents = selectedComponents.map((component) =>
      component.id === id ? { ...component, type: component.type } : component
    );
    setSelectedComponents(editedComponents);
  };

  const deleteComponent = (id) => {
    const filteredComponents = selectedComponents.filter(
      (component) => component.id !== id
    );
    setSelectedComponents(filteredComponents);
  };

  const renderComponent = (component) => {
    switch (component.type) {
      case "Text":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <textarea
              className="w-full p-2 border rounded-lg"
              rows="4"
              placeholder="Enter text..."
            ></textarea>
          </div>
        );
      case "Image":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              accept="image/*"
            />
          </div>
        );
      case "Heading":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Enter heading..."
            />
          </div>
        );
      case "Graph":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <p>Graph component placeholder</p>
            {/* You can integrate a graph library here */}
          </div>
        );
      case "Equation":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <p>Equation component placeholder</p>
            {/* You can integrate an equation editor here */}
          </div>
        );
      case "Markdown":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <textarea
              className="w-full p-2 border rounded-lg"
              rows="4"
              placeholder="Enter markdown..."
            ></textarea>
          </div>
        );
      case "Quiz":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <CreateMCQ />
          </div>
        );
      case "Fill in the Blanks":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <CreateFIB />
          </div>
        );
      case "Video":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              accept="video/*"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex bg-gray-100">
      <div className="w-1/4 bg-white p-4 shadow-md">
        <div className="mb-6">
          <button className="text-blue-500">{"<-- Back to Home"}</button>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">
            Nothing purifies than knowledge
          </h2>
          <p>
            The whole idea is to develop an authoring platform to create
            interactive content with just a few clicks.
          </p>
        </div>
        <ul className="mb-6">
          {chapters.map((chapter, index) => (
            <li key={index} className="mb-2 cursor-pointer">
              {chapter}
            </li>
          ))}
        </ul>
        <button
          onClick={addNewChapter}
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Add New Chapter
        </button>
      </div>

      <div className="w-3/4 p-6">
        <div className="flex justify-between mb-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            DISCARD
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            PREVIEW
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            EDIT
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            SAVE
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            PUBLISH
          </button>
        </div>

        <div className="bg-white p-4 shadow-md mb-6">
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Add Title"
          />
          <textarea
            className="w-full mb-4 p-2 border rounded-lg"
            rows="4"
            placeholder="Add Summary"
          ></textarea>
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Add Tag"
          />

          {selectedComponents.map((component) => (
            <div key={component.id} className="relative">
              {renderComponent(component)}
              <div className="absolute right-2 top-2 flex space-x-2">
                <button
                  onClick={() => editComponent(component.id)}
                  className="text-yellow-600"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => deleteComponent(component.id)}
                  className="text-red-600"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={toggleFormOptions}
            className="w-full mb-4 bg-gray-200 p-2 rounded-lg"
          >
            + Add Form
          </button>

          {showFormOptions && (
            <div className="p-4 bg-gray-100 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Heading",
                  "Text",
                  "Image",
                  "Graph",
                  "Equation",
                  "Markdown",
                  "Quiz",
                  "Video",
                  "Fill in the Blanks",
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleFormOptionClick(option)}
                    className="bg-white p-2 border rounded-lg shadow-sm hover:bg-gray-200 transition duration-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 shadow-md">
          <p>
            <strong>Note:</strong> The collection chapters is to form a book.
            Adding a new chapter means adding a predefined form to capture
            input. The chapter further dripped into sections and sub-sections;
            alternatively can be grouped into categories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateBookStore;
