import React, { useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import BookCover1 from "../image/BookCover1.png";
import CreateMCQ from "./CreateMCQ";
import CreateFIB from "./CreateFIB";
import Heading from "./CreateHeading";
import Text from "./CreateText";
import Graph from "./CreateGraph";
import Equation from "./CreateEquation";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import PreviewBook from "./PreviewBookStore";
import { updatePublish, updateChapters } from "../API/createbook";
import store from "./../store/store";
import * as useractions from "./../store/actions/bookactions";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../store/utils/notify";
const CreateBookStore = ({ bookinfo }) => {
  const curbookdispatch = useDispatch();
  // const curbook = useSelector((state) => state.createbook);
  store.dispatch(useractions.setBookDetails(bookinfo));
  const book_ID = bookinfo._id;
  console.log(bookinfo);
  const navigate = useNavigate();
  const [chapters, setChapters] = useState(bookinfo.chapters);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [showFormOptions, setShowFormOptions] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [issave, setissave] = useState(false);
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
  const handlePreviewBookStore = () => {
    setShowPreview((prev) => {
      console.log(chapters);
      return !prev;
    });
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleDiscard = () => {
    // setChapters([]);
    // setIsIntro(false);
    // setShowFormOptions(false);
    // setSelectedComponents([]);
    // setTitle("");
    // setSummary("");
    // setSelectedChapterIndex(null);
    // setShowPreview(false);
    // setSelectedChapterIndex(null);
  };

  // Update `handlePublish` function
  const handlePublish = async () => {
    if (bookinfo.ispublished === null) {
      const updatedBookInfo = { ...bookinfo, ispublished: false }; // Update `ispublished` to false
      // console.log(updatedBookInfo);
      try {
        const response = await updatePublish(updatedBookInfo._id, false); // Pass only the ID to the API function
        console.log(response?.status);

        if (response === true) {
          notify("Book successfully published");

          // Update `bookinfo` in the Redux store with the new state of `ispublished`
          curbookdispatch(useractions.setPublish(updatedBookInfo));
        } else {
          notify("Failed to publish book");
        }
      } catch (error) {
        console.error("Error publishing book:", error);
        notify("An error occurred while publishing the book");
      }
    } else {
      notify("Book is already published");
    }
  };

  const saveChapter = async () => {
    setissave(true);
    const newChapter = {
      title,
      summary,
      components: selectedComponents,
    };

    let updatedChapters;

    if (selectedChapterIndex !== null) {
      updatedChapters = chapters.map((chapter, index) =>
        index === selectedChapterIndex ? newChapter : chapter
      );
      curbookdispatch(
        useractions.updateChapter(selectedChapterIndex, newChapter)
      );
    } else {
      updatedChapters = [...chapters, newChapter];
      curbookdispatch(useractions.addChapter(newChapter));
    }
    const res = await updateChapters(book_ID, updatedChapters);
    if (!res) {
      notify("Failed to save chapters");
    } else {
      setChapters(updatedChapters);
    }

    setissave(false);
  };

  const editChapter = (index) => {
    const chapter = chapters[index];
    setSelectedChapterIndex(index);
    setTitle(chapter?.title);
    setSummary(chapter?.summary);
    setSelectedComponents(chapter?.components);
  };

  const deleteChapter = (index) => {
    curbookdispatch(useractions.deleteChapter(index));
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
  };

  const toggleFormOptions = () => {
    setShowFormOptions(!showFormOptions);
  };

  const handleFormOptionClick = (option) => {
    setSelectedComponents([
      ...selectedComponents,
      { type: option, id: Date.now(), content: "", locked: false },
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
            value={component.content}
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
      case "FillInTheBlanks":
        console.log(component);
        return (
          <CreateFIB
            value={component.content}
            onChange={(newContent) =>
              handleComponentChange(component.id, newContent)
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
      case "Image":
        return (
          <div className="mb-4 p-2 border rounded-lg">
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              accept="image/*"
              onChange={(e) =>
                handleComponentChange(
                  component.id,
                  URL.createObjectURL(e.target.files[0])
                )
              }
            />
            {component.content && (
              <img
                src={component.content}
                alt="Uploaded"
                className="mt-4 max-h-64 w-auto max-w-full object-contain"
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
    <div className="flex justify-center bg-gray-100 relative flex-col sm:flex-row">
      {!showPreview && (
        <>
          <div className="sm:w-1/4 bg-white p-4 shadow-md lg:static top-0 left-0 h-full transition-transform duration-300">
            <div className="mb-6">
              <h2
                className="text-2xl font-bold mb-2 text-center"
                dangerouslySetInnerHTML={{ __html: bookinfo.booktitle }}
              />
              <p
                className="text-center"
                dangerouslySetInnerHTML={{ __html: bookinfo.description }}
              />
              <img
                src={bookinfo.image ? bookinfo.image : BookCover1}
                className="h-1/2"
              />
            </div>
            <ul className="mb-6">
              {chapters?.map((chapter, index) => (
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
                      <span>{chapter?.title || `Chapter ${index + 1}`}</span>
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
                  {expandedChapters.includes(index) && (
                    <ul className="pl-6 mt-2">
                      {chapter.components
                        .filter((comp) => comp.type === "Heading")
                        .map((comp) => (
                          <li key={comp.id}>
                            {comp.content.replace(/<[^>]+>/g, "")}{" "}
                            {/* Strips HTML tags */}
                          </li>
                        ))}
                    </ul>
                  )}
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

          <div className=" w-full sm:w-3/4 p-2 sm:p-6">
            <div className="flex  flex-col justify-around mb-6 sm:flex-row">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg my-1"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg  my-1"
                onClick={saveChapter}
              >
                {issave ? "Saving..." : "Save"}
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg cursor-pointer  my-1"
                onClick={handleDiscard}
              >
                Discard
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer  my-1"
                onClick={handlePublish}
              >
                Publish
              </button>
              <button
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg  my-1"
                onClick={handlePreviewBookStore}
              >
                {!showPreview ? "Preview" : "Close"}
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

            {selectedComponents?.map((component) => (
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
                    "FillInTheBlanks",
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
        </>
      )}
      {/* <div className="flex justify-between mb-6"> */}
      {showPreview ? (
        <div className="flex flex-col w-full">
          <button
            className={`w-48 bg-blue-500 text-white py-4 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ${
              showPreview ? "mt-4" : ""
            }`}
            onClick={handlePreviewBookStore}
          >
            {showPreview ? "Close Preview" : "Preview"}
          </button>

          {showPreview && (
            <PreviewBook chapters={chapters} bookinfo={bookinfo} ispre={true} />
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CreateBookStore;
