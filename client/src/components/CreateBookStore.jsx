import React, { useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import BookCover1 from "../image/BookCover1.png";
import axios from "axios";
import { ToLink } from "../App";
import renderComponent from "./functions/renderComponent";
import SunEditor from "suneditor-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [issave, setissave] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [chapters, setChapters] = useState(
    bookinfo?.chapters.map((chapter) => ({
      ...chapter,
      sections: chapter?.sections || [],
    }))
  );
  const [sections, setSections] = useState([]);
  const [Subsections, setSubsections] = useState(
    bookinfo?.chapters?.sections?.Subsections || []
  );

  const [expandedChapters, setExpandedChapters] = useState([]);
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandedSubsections, setExpandedSubsections] = useState([]);
  const [selectedSubsectionIndex, setSelectedSubsectionIndex] = useState(null);

  const toggleChapterExpansion = (index) => {
    if (expandedChapters.includes(index)) {
      setExpandedChapters(expandedChapters.filter((i) => i !== index));
    } else {
      setExpandedChapters([...expandedChapters, index]);
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
    console.log(chapters);
    setissave(true);
    const newChapter = {
      title,
      summary,
      sections: sections,
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

  const saveSection = (chapterIndex, sectionIndex) => {
    const updatedSection = {
      title,
      summary,
      Subsections: Subsections,
    };

    const updatedSections = chapters[chapterIndex].sections.map(
      (section, idx) => (idx === sectionIndex ? updatedSection : section)
    );

    const updatedChapters = chapters.map((chap, idx) =>
      idx === chapterIndex ? { ...chap, sections: updatedSections } : chap
    );

    setChapters(updatedChapters);
    setSelectedChapterIndex(null);
    setTitle("");
    setSummary("");
    setSubsections([]);
  };

  const deleteChapter = (index) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
    curbookdispatch(useractions.deleteChapter(index));
  };
  const editChapter = (index) => {
    const chapter = chapters[index];
    setSelectedChapterIndex(index);
    setTitle(chapter.title);
    setSummary(chapter.summary);
    setSelectedComponents(chapter.components);
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

  const editSection = (chapterIndex, sectionIndex) => {
    const section = chapters[chapterIndex].sections[sectionIndex];
    setSelectedChapterIndex(chapterIndex);
    setSelectedSectionIndex(sectionIndex);
    setTitle(section.title);
    setSummary(section.summary);
    setSelectedComponents(section.components);
  };
  const deleteSection = (chapterIndex, sectionIndex) => {
    const updatedChapters = chapters.map((chapter, chIdx) =>
      chIdx === chapterIndex
        ? {
            ...chapter,
            sections: chapter.sections.filter((_, idx) => idx !== sectionIndex),
          }
        : chapter
    );
    setChapters(updatedChapters);
  };

  // Function to save section

  // Function to delete section
  const deleteSubsection = (chapterIndex, sectionIndex, subsectionIndex) => {
    const updatedChapters = chapters.map((chapter, chIdx) =>
      chIdx === chapterIndex
        ? {
            ...chapter,
            sections: chapter.sections.map((section, secIdx) =>
              secIdx === sectionIndex
                ? {
                    ...section,
                    subsections: section.subsections.filter(
                      (_, subIdx) => subIdx !== subsectionIndex
                    ),
                  }
                : section
            ),
          }
        : chapter
    );
    setChapters(updatedChapters);
  };

  // Function to edit subsection
  const editSubsection = (chapterIndex, sectionIndex, subsectionIndex) => {
    const subsection =
      chapters[chapterIndex].sections[sectionIndex].subsections[
        subsectionIndex
      ];
    setSelectedChapterIndex(chapterIndex);
    setSelectedSectionIndex(sectionIndex);
    setSelectedSubsectionIndex(subsectionIndex);
    setTitle(subsection.title);
    setSummary(subsection.summary);
    setSelectedComponents(subsection.components);
  };

  const toggleExpansion = (list, setList, index) => {
    if (list.includes(index)) {
      setList(list.filter((i) => i !== index));
    } else {
      setList([...list, index]);
    }
  };

  const addNewChapter = () => {
    const newChapter = {
      title: `Chapter ${chapters.length + 1}`,
      sections: [],
    };
    setChapters([...chapters, newChapter]);
  };

  const addNewSection = (chapterIndex) => {
    const newSection = {
      title: `Section ${chapters[chapterIndex].sections.length + 1}`,
      subsections: [],
    };
    const updatedChapters = chapters.map((chapter, idx) =>
      idx === chapterIndex
        ? { ...chapter, sections: [...chapter.sections, newSection] }
        : chapter
    );
    setChapters(updatedChapters);
  };

  const addNewSubsection = (chapterIndex, sectionIndex) => {
    const newSubsection = {
      title: `Subsection ${
        chapters[chapterIndex].sections[sectionIndex].subsections.length + 1
      }`,
      components: [],
    };
    const updatedChapters = chapters.map((chapter, chIdx) =>
      chIdx === chapterIndex
        ? {
            ...chapter,
            sections: chapter.sections.map((section, secIdx) =>
              secIdx === sectionIndex
                ? {
                    ...section,
                    subsections: [...section.subsections, newSubsection],
                  }
                : section
            ),
          }
        : chapter
    );
    setChapters(updatedChapters);
  };

  const saveSubsection = (chapterIndex, sectionIndex, subsectionIndex) => {
    const updatedSubsection = {
      title,
      summary,
      components: selectedComponents,
    };

    const updatedChapters = chapters.map((chapter, chIdx) =>
      chIdx === chapterIndex
        ? {
            ...chapter,
            sections: chapter.sections.map((section, secIdx) =>
              secIdx === sectionIndex
                ? {
                    ...section,
                    subsections: section.subsections.map((subsection, subIdx) =>
                      subIdx === subsectionIndex
                        ? updatedSubsection
                        : subsection
                    ),
                  }
                : section
            ),
          }
        : chapter
    );

    setChapters(updatedChapters);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setSelectedComponents([]);
    setSelectedChapterIndex(null);
    setSelectedSectionIndex(null);
    setSelectedSubsectionIndex(null);
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections.length + 1}`,
      subsections: [],
    };
    setSections((prev) => [...prev, newSection]);
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
                <div key={chapterIndex}>
                  <div>
                    <h3
                      onClick={() =>
                        toggleExpansion(
                          expandedChapters,
                          setExpandedChapters,
                          chapterIndex
                        )
                      }
                    >
                      {chapter.title}
                      <button onClick={() => editChapter(chapterIndex)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => deleteChapter(chapterIndex)}>
                        <FaTrashAlt />
                      </button>
                    </h3>
                  </div>

                  {expandedChapters?.includes(chapterIndex) && (
                    <div>
                      {chapter.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          <h4
                            onClick={() =>
                              toggleExpansion(
                                expandedSections,
                                setExpandedSections,
                                `${chapterIndex}-${sectionIndex}`
                              )
                            }
                          >
                            {section.title}
                            <button
                              onClick={() =>
                                editSection(chapterIndex, sectionIndex)
                              }
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                deleteSection(chapterIndex, sectionIndex)
                              }
                            >
                              <FaTrashAlt />
                            </button>
                          </h4>

                          {expandedSections.includes(
                            `${chapterIndex}-${sectionIndex}`
                          ) && (
                            <div>
                              {section.subsections.map(
                                (subsection, subsectionIndex) => (
                                  <div key={subsectionIndex}>
                                    <h5>
                                      {subsection.title}
                                      <button
                                        onClick={() =>
                                          editSubsection(
                                            chapterIndex,
                                            sectionIndex,
                                            subsectionIndex
                                          )
                                        }
                                      >
                                        <FaEdit />
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteSubsection(
                                            chapterIndex,
                                            sectionIndex,
                                            subsectionIndex
                                          )
                                        }
                                      >
                                        <FaTrashAlt />
                                      </button>
                                    </h5>
                                  </div>
                                )
                              )}
                              <button
                                onClick={() =>
                                  addNewSubsection(chapterIndex, sectionIndex)
                                }
                              >
                                + Add Subsection
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addNewSection(chapterIndex)}>
                        + Add Section
                      </button>
                    </div>
                  )}
                </div>
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

            {sections.map((section) => (
              <div key={section.id}>
                <Section
                  value={section}
                  onChange={(updatedSection) =>
                    handleUpdateSection(section.id, updatedSection)
                  }
                  onDelete={() => handleDeleteSection(section.id)}
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

      {/* {sections.map((section) => (
        <div key={section.id}>
          <Section
            value={section}
            onChange={(updatedSection) =>
              handleUpdateSection(section.id, updatedSection)
            }
            onDelete={() => handleDeleteSection(section.id)}
          />
        </div>
      ))} */}

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
