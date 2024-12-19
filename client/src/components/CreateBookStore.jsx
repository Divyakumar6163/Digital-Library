import React, { useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import BookCover1 from "../image/NoImage.jpg";
import axios from "axios";
import { ToLink } from "../App";
import renderComponent from "./functions/renderComponent";
import "suneditor/dist/css/suneditor.min.css";
import PreviewBook from "./PreviewBookStore";
import { updatePublish, updateChapters, deleteBook } from "../API/createbook";
import store from "./../store/store";
import * as useractions from "./../store/actions/bookactions";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../store/utils/notify";
import UpdateBookIntro from "./UpdateIntro";
import Section from "./CreateBookComponents/Section";
const CreateBookStore = ({ bookinfo }) => {
  const curbookdispatch = useDispatch();
  // const curbook = useSelector((state) => state.createbook);
  store.dispatch(useractions.setBookDetails(bookinfo));
  const book_ID = bookinfo._id;
  // console.log(bookinfo);
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [showFormOptions, setShowFormOptions] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [issave, setissave] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [chapters, setChapters] = useState(
    bookinfo?.chapters.map((chapter) => ({
      ...chapter,
      sections: chapter?.sections || [],
    }))
  );
  const [sections, setSections] = useState([]);

  const [expandedChapters, setExpandedChapters] = useState([]);
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandedSubsections, setExpandedSubsections] = useState([]);
  const toggleExpansion = (index, type) => {
    if (type === "chapter") {
      setExpandedChapters((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else if (type === "section") {
      setExpandedSections((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else if (type === "subsection") {
      setExpandedSubsections((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    }
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
  const handleIntro = () => {
    setShowIntro(true);
  };
  const handleDiscard = async () => {
    try {
      const response = await deleteBook(bookinfo._id);
      console.log(response?.status);
      if (response === true) {
        notify("Book deleted successfully");
        navigate(-1);
      } else {
        notify("Failed to delete book");
      }
    } catch (e) {
      console.error("Error discarding book:", e);
      notify("An error occurred while discarding the book");
    }
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
          navigate(-1);
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
      sections: sections,
    };
    console.log(newChapter);

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
      console.log(updatedChapters);
      curbookdispatch(useractions.addChapter(newChapter));
    }
    const res = await updateChapters(book_ID, updatedChapters);
    if (!res) {
      notify("Failed to save chapters");
    } else {
      setChapters(updatedChapters);
      notify("Chapters saved successfully");
    }

    setissave(false);
  };

  const deleteChapter = (index) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
    curbookdispatch(useractions.deleteChapter(index));
  };
  const editChapter = (index) => {
    const chapter = chapters[index];
    setSelectedChapterIndex(index);
    setTitle(chapter?.title || `Chapter ${index + 1}`);
    setSummary(chapter?.summary || `Summary of Chapter ${index + 1}`);
    // setSelectedComponents(chapter.sections);
    setSections(chapter?.sections);
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

  const handleComponentChange = async (id, content, component) => {
    if (component === "Image") {
      const formData = new FormData();
      formData.append("image", content);
      const uploadResponse = await axios.post(`${ToLink}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const profileImageUrl = uploadResponse.data.fileUrl;
      console.log(profileImageUrl);
      const updatedComponents = selectedComponents.map((component) =>
        component.id === id
          ? { ...component, content: profileImageUrl }
          : component
      );
      setSelectedComponents(updatedComponents);
    } else {
      const updatedComponents = selectedComponents.map((component) =>
        component.id === id ? { ...component, content } : component
      );
      setSelectedComponents(updatedComponents);
    }
  };

  const addNewChapter = () => {
    const newChapter = {
      title: `Chapter ${chapters.length + 1}`,
      sections: [],
    };
    setChapters([...chapters, newChapter]);
    setSummary("");
    setTitle("");
    setSections([]);
    editChapter(chapters.length);
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections?.length + 1}`,
      subsections: [],
    };
    if (sections?.length) {
      setSections((prev) => [...prev, newSection]);
    } else {
      setSections([newSection]);
    }
  };

  const handleUpdateSection = (id, updatedSection) => {
    const updatedSections = sections.map((sec) =>
      sec.id === id ? updatedSection : sec
    );
    setSections(updatedSections);
  };

  const handleDeleteSection = (id) => {
    setSections((prev) => prev.filter((sec) => sec.id !== id));
  };

  console.log(sections);
  console.log(chapters);
  return (
    <div className="flex justify-center bg-gray-100 relative flex-col sm:flex-row">
      {!showPreview && !showIntro && (
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
                src={bookinfo?.image ? bookinfo?.image : BookCover1}
                className="h-1/2"
              />
            </div>
            <ul>
              {chapters?.map((chapter, chapterIndex) => (
                <li key={chapterIndex} className="mb-2">
                  <div className="flex justify-between items-center">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleExpansion(chapterIndex, "chapter")}
                    >
                      {expandedChapters.includes(chapterIndex) ? (
                        <FaChevronDown className="mr-2" />
                      ) : (
                        <FaChevronRight className="mr-2" />
                      )}
                      <span>
                        {chapter?.title || `Chapter ${chapterIndex + 1}`}
                      </span>
                    </div>
                    <div>
                      <button
                        className="text-blue-500 mr-2"
                        onClick={() => editChapter(chapterIndex)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => deleteChapter(chapterIndex)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  {expandedChapters?.includes(chapterIndex) && (
                    <ul className="pl-6">
                      {chapter?.sections?.map((section, sectionIndex) => (
                        <li key={sectionIndex} className="mb-2">
                          <div className="flex justify-between items-center">
                            <div
                              className="flex items-center cursor-pointer"
                              onClick={() =>
                                toggleExpansion(
                                  `${chapterIndex}-${sectionIndex}`,
                                  "section"
                                )
                              }
                            >
                              {expandedSections?.includes(
                                `${chapterIndex}-${sectionIndex}`
                              ) ? (
                                <FaChevronDown className="mr-2" />
                              ) : (
                                <FaChevronRight className="mr-2" />
                              )}
                              <span>
                                {section.title ||
                                  `Subsection ${chapterIndex + 1}.${
                                    sectionIndex + 1
                                  }`}
                              </span>
                            </div>
                          </div>
                          {expandedSections.includes(
                            `${chapterIndex}-${sectionIndex}`
                          ) && (
                            <ul className="pl-6">
                              {section.subsections.map(
                                (subsection, subsectionIndex) => (
                                  <li key={subsectionIndex} className="mb-2">
                                    <div className="flex justify-between items-center">
                                      <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() =>
                                          toggleExpansion(
                                            `${chapterIndex}-${sectionIndex}-${subsectionIndex}`,
                                            "subsection"
                                          )
                                        }
                                      >
                                        {expandedSubsections.includes(
                                          `${chapterIndex}-${sectionIndex}-${subsectionIndex}`
                                        ) ? (
                                          <FaChevronDown className="mr-2" />
                                        ) : (
                                          <FaChevronRight className="mr-2" />
                                        )}
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              subsection.heading ||
                                              `Subsection ${chapterIndex + 1}.${
                                                sectionIndex + 1
                                              }.${subsectionIndex + 1}`,
                                          }}
                                        ></span>
                                      </div>
                                    </div>
                                    {expandedSubsections.includes(
                                      `${chapterIndex}-${sectionIndex}-${subsectionIndex}`
                                    ) && (
                                      <ul className="pl-6">
                                        {subsection?.components?.map(
                                          (comp, idx) => (
                                            <li
                                              key={idx}
                                              className="mb-2 flex justify-between"
                                            >
                                              <span>
                                                {comp.type === "Heading" && (
                                                  <span
                                                    dangerouslySetInnerHTML={{
                                                      __html:
                                                        comp.content ||
                                                        `Heading ${
                                                          chapterIndex + 1
                                                        }.${sectionIndex + 1}.${
                                                          subsectionIndex + 1
                                                        }.${idx + 1}`,
                                                    }}
                                                  />
                                                )}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
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
                className="bg-gray-500 text-white py-2 px-4 rounded-lg my-1"
                onClick={handleIntro}
              >
                Update Intro
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
              <textarea
                className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Add Chapter Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            {selectedComponents?.map((component) => (
              <div key={component.id} className="relative">
                {renderComponent(component, handleComponentChange)}
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

            {sections?.map((section) => (
              <div key={section.id}>
                <Section
                  value={section}
                  onChange={(updatedSection) =>
                    handleUpdateSection(section.id, updatedSection)
                  }
                  onDelete={() => handleDeleteSection(section.id)}
                  saveChapter={saveChapter}
                />
              </div>
            ))}
            <button
              onClick={handleAddSection}
              className="w-full mb-4 bg-gray-200 p-2 rounded-lg"
            >
              + Add Section
            </button>

            {showFormOptions && (
              <div className="p-4 bg-gray-100 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Section",
                    "Subsection",
                    "Heading",
                    "Text",
                    "Image",
                    "Graph",
                    "Equation",
                    "Quiz",
                    "Video",
                    "FillInTheBlanks",
                  ]?.map((option, index) => (
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

      {showPreview ? (
        <div className="flex flex-col w-full">
          <button
            className={`mx-5 w-40 text-gray-700 font-semibold px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200 ${
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

      {showIntro && (
        <UpdateBookIntro
          bookIntroDetails={bookinfo}
          setShowIntro={setShowIntro}
        />
      )}
    </div>
  );
};

export default CreateBookStore;
