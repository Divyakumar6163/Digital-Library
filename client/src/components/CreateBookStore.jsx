import React, { useState, useEffect } from "react";
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
import styles from "./CreateBookStore.module.css";
import Section from "./CreateBookComponents/Section";
import { socket } from "../API/socket";
const CreateBookStore = ({ bookinfo }) => {
  const curbookdispatch = useDispatch();
  store.dispatch(useractions.setBookDetails(bookinfo));
  const book_ID = bookinfo._id;
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
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
  const [status, setStatus] = useState("Connecting...");

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

    if (selectedChapterId !== null) {
      updatedChapters = chapters.map((chapter, index) =>
        chapter._id === selectedChapterId ? newChapter : chapter
      );
      curbookdispatch(useractions.updateChapter(selectedChapterId, newChapter));
    } else {
      updatedChapters = [...chapters, newChapter];
      console.log(updatedChapters);
      curbookdispatch(useractions.addChapter(newChapter));
    }
    const res = await updateChapters(book_ID, updatedChapters);
    console.log(res);
    if (!res.status || res.status !== 200) {
      notify("Failed to save chapters");
    } else {
      setChapters(updatedChapters);
      notify("Chapters saved successfully");
    }

    setissave(false);
  };

  const deleteChapter = (id, index) => {
    const updatedChapters = chapters.filter((chpid) => chpid._id !== id);
    setChapters(updatedChapters);
    socket.emit("remove-chapter", { bookId: book_ID, chapterId: id });
    curbookdispatch(useractions.deleteChapter(index));
  };
  const editChapter = (id, index) => {
    if (id === selectedChapterId) return;
    const chapter = chapters[index];
    setSelectedChapterId(id);
    setTitle(chapter?.title || `Chapter ${index + 1}`);
    setSummary(chapter?.summary || `Summary of Chapter ${index + 1}`);
    // setSelectedComponents(chapter.sections);
    console.log("Chapter Section:", chapter?.sections);
    setSections(chapter?.sections);
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

  const addNewChapter = async () => {
    const newChapter = {
      title: `Chapter ${chapters?.length + 1}`,
      sections: [],
    };
    const res = await updateChapters(book_ID, [...chapters, newChapter]);
    console.log(res);
    if (!res.status || res.status !== 200) {
      notify("Failed to add new chapter");
      return;
    }
    setChapters(res.data.data.newbook.chapters);
    const chpters = res.data.data.newbook.chapters;
    console.log("chpters", chpters);
    socket.emit("add-chapter", {
      bookId: book_ID,
      chapter: chpters[chpters.length - 1],
    });
    setSummary("");
    setTitle("");
    setSections([]);
    editChapter(chpters._id, chapters.length);
  };

  const handleAddSection = async () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections.length + 1}`,
      subsections: [],
      components: [],
    };

    let updatedChapters;

    setChapters((prev) => {
      updatedChapters = prev.map((ch) =>
        ch._id === selectedChapterId
          ? { ...ch, sections: [...(ch.sections || []), newSection] }
          : ch
      );
      return updatedChapters;
    });

    socket.emit("add-chapter-sections", {
      bookId: book_ID,
      chpId: selectedChapterId,
      newSection,
    });

    // ✅ SAVE THE CORRECT STATE
    await updateChapters(book_ID, updatedChapters);
  };

  const handleUpdateSection = (id, updatedSection) => {
    const updatedSections = sections.map((sec) =>
      sec.id === id ? updatedSection : sec
    );
    setSections(updatedSections);
  };

  const handleDeleteSection = (sectionId) => {
    if (!selectedChapterId) return;
    setChapters((prev) =>
      prev.map((ch) =>
        ch._id === selectedChapterId
          ? {
              ...ch,
              sections: (ch.sections || []).filter(
                (sec) => sec.id !== sectionId
              ),
            }
          : ch
      )
    );
    curbookdispatch(useractions.deleteSection(selectedChapterId, sectionId));
    // Socket broadcast
    socket.emit("remove-section", {
      bookId: book_ID,
      chpId: selectedChapterId,
      sectionId,
    });
  };

  // Socket Connection
  useEffect(() => {
    socket.on("connect", () => {
      setStatus("Socket connected to server");
      console.log("Connected:", socket.id);
    });
    socket.on("disconnect", () => {
      setStatus("Socket Disconnected");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    socket.emit("join-book", book_ID);

    return () => {
      socket.emit("leave-book", book_ID);
    };
  }, [book_ID]);

  // Chapter Added Socket
  useEffect(() => {
    // socket.emit("join-book", book_ID);
    socket.on("chapter-added", (newChapter) => {
      setChapters((prev) => [...prev, newChapter]);
    });

    return () => {
      socket.off("chapter-added");
    };
  }, []);

  //Remove a Chapter
  useEffect(() => {
    console.log("Setting up chapter-removed listener");
    socket.on("chapter-removed", (chapterId) => {
      setChapters((prevChapters) =>
        prevChapters.filter((chp) => chp?._id?.toString() !== chapterId)
      );
    });
  }, []);

  // Update Chapter Title
  useEffect(() => {
    const handler = ({ chpId, title }) => {
      setChapters((prev) =>
        prev.map((ch) => (ch._id === chpId ? { ...ch, title } : ch))
      );

      if (chpId === selectedChapterId) {
        setTitle(title);
      }
    };

    socket.on("chapter-title-updated", handler);

    return () => {
      socket.off("chapter-title-updated", handler);
    };
  }, [selectedChapterId]);
  //Update Chapter Summary
  useEffect(() => {
    const handler = ({ chpId, summary }) => {
      setChapters((prev) =>
        prev.map((ch) => (ch._id === chpId ? { ...ch, summary } : ch))
      );
      if (chpId === selectedChapterId) {
        setSummary(summary);
      }
    };
    socket.on("chapter-summary-updated", handler);

    return () => {
      socket.off("chapter-summary-updated", handler);
    };
  }, [selectedChapterId]);

  //Add Section to Chapter
  useEffect(() => {
    const handler = ({ chpId, newSection }) => {
      setChapters((prev) =>
        prev.map((ch) =>
          ch._id === chpId
            ? { ...ch, sections: [...(ch.sections || []), newSection] }
            : ch
        )
      );
      if (chpId === selectedChapterId) {
        setSections((prev) => [...prev, newSection]);
      }
    };

    socket.on("chapter-sections-added", handler);
    return () => {
      socket.off("chapter-sections-added", handler);
    };
  }, [selectedChapterId]);
  //Remove Section from Chapter
  useEffect(() => {
    const handler = ({ chpId, sectionId }) => {
      setChapters((prev) =>
        prev.map((ch) =>
          ch._id === chpId
            ? {
                ...ch,
                sections: (ch.sections || []).filter(
                  (sec) => sec.id !== sectionId
                ),
              }
            : ch
        )
      );
      if (chpId === selectedChapterId) {
        setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
      }
    };
    socket.on("section-removed", handler);
    return () => {
      socket.off("section-removed", handler);
    };
  }, [selectedChapterId]);

  //Section Title Update
  
  useEffect(() => {
    if (!selectedChapterId) return;
    
    const chapter = chapters.find((ch) => ch._id === selectedChapterId);
    
    if (chapter) {
      setSections(chapter.sections || []);
    }
  }, [chapters, selectedChapterId]);
  
  useEffect(() => {
    const handler = ({ chapters }) => {
      setChapters((prev) => (prev = chapters));
    };

    socket.on("section-title-updated", handler);
    return () => {
      socket.off("section-title-updated", handler);
    };
  }, []);
  useEffect(() => {
    const handler = ({ chapterId, sectionId, title }) => {
      setChapters((prev) =>
        prev.map((ch) =>
          ch._id === chapterId
            ? {
                ...ch,
                sections: ch.sections.map((sec) =>
                  sec.id === sectionId ? { ...sec, title } : sec
                ),
              }
            : ch
        )
      );
    };

    socket.on("section-title-updated", handler);
    return () => socket.off("section-title-updated", handler);
  }, []);

  console.log(sections);
  console.log("Chapters:", chapters);
  return (
    <div className={styles.container}>
      {!showPreview && !showIntro && (
        <>
          <div className={styles.sidebar}>
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
                        onClick={() => editChapter(chapter?._id, chapterIndex)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => deleteChapter(chapter._id, chapterIndex)}
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

          <div className={styles.mainContent}>
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
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);

                  socket.emit("update-chapter-title", {
                    bookId: book_ID,
                    chpId: selectedChapterId,
                    title: newTitle,
                  });
                }}
              />
              <textarea
                className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Add Chapter Summary"
                value={summary}
                onChange={(e) => {
                  const newSummary = e.target.value;
                  setSummary(newSummary);
                  socket.emit("update-chapter-summary", {
                    bookId: book_ID,
                    chpId: selectedChapterId,
                    summary: newSummary,
                  });
                }}
              />
            </div>

            {selectedComponents?.map((component) => (
              <div key={component?.id} className="relative">
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
              <Section
                key={section.id}
                bookId={book_ID}
                chapters={chapters}
                chapterId={selectedChapterId}
                value={section}
                onChange={(updatedSection) =>
                  handleUpdateSection(section.id, updatedSection)
                }
                onDelete={() => handleDeleteSection(section.id)}
              />
            ))}

            <button
              onClick={handleAddSection}
              className="w-full mb-4 bg-gray-200 p-2 rounded-lg"
            >
              + Add Section
            </button>
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
