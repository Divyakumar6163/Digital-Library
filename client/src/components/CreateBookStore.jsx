import React, { useState } from "react";
import { FaTrashAlt, FaBars } from "react-icons/fa"; // Removed FaEdit
import CreateMCQ from "./CreateMCQ";
import CreateFIB from "./CreateFIB";
import Heading from "./CreateHeading";
import Text from "./CreateText";
import Graph from "./CreateGraph";
import Equation from "./CreateEquation";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import SunEditor CSS

const CreateBookStore = () => {
  const [chapters, setChapters] = useState([]);
  const [showFormOptions, setShowFormOptions] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control hamburger menu
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

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
      { type: option, id: Date.now(), file: null },
    ]);
  };

  const deleteComponent = (id) => {
    const filteredComponents = selectedComponents.filter(
      (component) => component.id !== id
    );
    setSelectedComponents(filteredComponents);
  };

  const handleFileUpload = (id, file) => {
    const updatedComponents = selectedComponents.map((component) =>
      component.id === id
        ? { ...component, file: URL.createObjectURL(file) }
        : component
    );
    setSelectedComponents(updatedComponents);
  };

  const renderComponent = (component) => {
    switch (component.type) {
      case "Text":
        return <Text />;
      case "Image":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload(component.id, e.target.files[0])
              }
            />
            {component.file && (
              <img
                src={component.file}
                alt="Uploaded"
                className="mt-4 max-h-64"
              />
            )}
          </div>
        );
      case "Heading":
        return <Heading />;
      case "Graph":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <Graph />
          </div>
        );
      case "Equation":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <Equation />
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
              onChange={(e) =>
                handleFileUpload(component.id, e.target.files[0])
              }
            />
            {component.file && (
              <video
                controls
                src={component.file}
                className="mt-4 max-h-64 w-full"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex bg-gray-100 relative">
      <div className="lg:hidden absolute top-4 left-4 z-20">
        <button
          className="text-blue-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars size={30} />
        </button>
      </div>
      <div
        className={`lg:w-1/4 bg-white p-4 shadow-md lg:static absolute top-0 left-0 h-full transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-10`}
      >
        <div className="mb-6 lg:hidden">
          <button
            className="text-blue-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Close
          </button>
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

      {/* Overlay effect for the background */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-0"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:w-3/4 p-6 w-full">
        <div className="flex justify-between mb-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            DISCARD
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            PREVIEW
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            SAVE
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            PUBLISH
          </button>
        </div>

        <div className="bg-white p-4 shadow-md mb-6">
          {/* SunEditor for Title */}
          <SunEditor
            lang="en"
            placeholder="Add Title"
            setOptions={{
              height: 50,
              buttonList: [
                ["font", "fontSize", "formatBlock"],
                ["bold", "italic", "underline", "strike"],
                ["align", "list", "table"],
                ["undo", "redo"],
                ["codeView"],
              ],
            }}
            setContents={title}
            onChange={setTitle}
          />
          {/* SunEditor for Summary */}
          <SunEditor
            lang="en"
            placeholder="Add Summary"
            setOptions={{
              height: 150,
              buttonList: [
                ["font", "fontSize", "formatBlock"],
                ["bold", "italic", "underline", "strike"],
                ["align", "list", "table"],
                ["undo", "redo"],
                ["codeView"],
              ],
            }}
            setContents={summary}
            onChange={setSummary}
          />
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
