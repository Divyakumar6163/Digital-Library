import React, { useState } from "react";
import {
  FaTrashAlt,
  FaBars,
  FaEdit,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import CreateMCQ from "./CreateMCQ";
import CreateFIB from "./CreateFIB";
import Heading from "./CreateHeading";
import Text from "./CreateText";
import Graph from "./CreateGraph";
import Equation from "./CreateEquation";
import SunEditor from "suneditor-react";
import { useSelector } from "react-redux";
import "suneditor/dist/css/suneditor.min.css";

const CreateBookStore = () => {
  const [chapters, setChapters] = useState([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [showFormOptions, setShowFormOptions] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  // const heading = useSelector((state) => state.heading.content);
  // const text = useSelector((state) => state.text.content);

  const toggleChapterExpansion = (index) => {
    if (expandedChapters.includes(index)) {
      setExpandedChapters(expandedChapters.filter((i) => i !== index));
    } else {
      setExpandedChapters([...expandedChapters, index]);
    }
  };

  const addNewChapter = () => {
    setSelectedChapterIndex(null);
    setTitle("");
    setSummary("");
    setSelectedComponents([]);
  };

  const saveChapter = () => {
    const newChapter = {
      title,
      summary,
      components: selectedComponents,
    };

    if (selectedChapterIndex !== null) {
      const updatedChapters = [...chapters];
      updatedChapters[selectedChapterIndex] = newChapter;
      setChapters(updatedChapters);
    } else {
      setChapters([...chapters, newChapter]);
    }
    addNewChapter();
  };

  const editChapter = (index) => {
    const chapter = chapters[index];
    setSelectedChapterIndex(index);
    setTitle(chapter.title);
    setSummary(chapter.summary);
    setSelectedComponents(chapter.components);
  };

  const deleteChapter = (index) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
  };

  const toggleFormOptions = () => {
    setShowFormOptions(!showFormOptions);
  };

  const handleFormOptionClick = (option) => {
    setSelectedComponents([
      ...selectedComponents,
      { type: option, id: Date.now(), content: "" },
    ]);
  };

  const deleteComponent = (id) => {
    const filteredComponents = selectedComponents.filter(
      (component) => component.id !== id
    );
    setSelectedComponents(filteredComponents);
  };

  const handleComponentChange = (id, content) => {
    const updatedComponents = selectedComponents.map((component) =>
      component.id === id ? { ...component, content } : component
    );
    setSelectedComponents(updatedComponents);
  };

  const renderComponent = (component) => {
    console.log(component);
    switch (component.type) {
      case "Text":
        return (
          <Text
            value={component.content}
            onChange={(content) => handleComponentChange(component.id, content)}
          />
        );
      case "Heading":
        return (
          <Heading
            heading={component.content}
            onChange={(content) => handleComponentChange(component.id, content)}
          />
        );
      case "Graph":
        return (
          <Graph
            labels={component.content.labels || []}
            dataPoints={component.content.dataPoints || []}
            onChange={(content) => handleComponentChange(component.id, content)}
          />
        );
      case "Equation":
        return (
          <Equation
            initialEquation={component.content || ""}
            onChange={(content) => handleComponentChange(component.id, content)}
          />
        );
      case "Quiz":
        return (
          <CreateMCQ
            value={component.content}
            onChange={(content) => handleComponentChange(component.id, content)}
          />
        );
      case "Fill in the Blanks":
        return (
          <CreateFIB
            initialContent={component.content || ""}
            initialQuestions={component.questions || []}
            initialAnswers={component.answers || []}
            onContentChange={(newContent) =>
              handleComponentChange(component.id, { content: newContent })
            }
            onQuestionsChange={(newQuestions) =>
              handleComponentChange(component.id, { questions: newQuestions })
            }
            onAnswersChange={(newAnswers) =>
              handleComponentChange(component.id, { answers: newAnswers })
            }
          />
        );
      case "Video":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              accept="video/*"
              onChange={(e) =>
                handleComponentChange(
                  component.id,
                  URL.createObjectURL(e.target.files[0])
                )
              }
            />
            {component.content && (
              <video
                controls
                src={component.content}
                className="mt-4 max-h-64 w-full"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };
  console.log(chapters);
  return (
    <div className="container mx-auto p-4 min-h-screen flex bg-gray-100 relative">
      <div className="lg:w-1/4 bg-white p-4 shadow-md lg:static absolute top-0 left-0 h-full transition-transform duration-300">
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
              <div className="flex justify-between items-center">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleChapterExpansion(index)}
                >
                  {expandedChapters.includes(index) ? (
                    <FaChevronDown className="mr-2" />
                  ) : (
                    <FaChevronRight className="mr-2" />
                  )}
                  <span>{chapter.title || `Chapter ${index + 1}`}</span>
                </div>
                <div>
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => editChapter(index)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteChapter(index)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
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

      <div className="lg:w-3/4 p-6 w-full">
        <div className="flex justify-between mb-6">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={saveChapter}
          >
            Save
          </button>
        </div>
        <div className="mb-6">
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Add Chapter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
        </div>

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
    </div>
  );
};

export default CreateBookStore;
