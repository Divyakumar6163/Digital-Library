import React, { useState, useRef } from "react";
import CreateGraph from "./CreateBookComponents/CreateGraph";
import { BlockMath } from "react-katex";
import { notify } from "../store/utils/notify";
import * as useractions from "./../store/actions/bookactions";
import BookCover1 from "../image/NoImage.jpg";
import { updatePublish, deleteBook, updateChapters } from "../API/createbook";
import "katex/dist/katex.min.css";
import { FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import icons
import { useDispatch, useSelector } from "react-redux";
import * as bookactions from "./../store/actions/bookactions";
const AdminBook = ({ book, setIsBook }) => {
  const dispatch = useDispatch();
  const reduxBook = useSelector((state) => state.books.allbooks);
  const bookIndex = reduxBook.find((b) => b._id === book._id);
  console.log(bookIndex);
  const [chapters, setChapters] = useState(book.chapters); // Store chapters in state
  console.log(chapters);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandedSubsections, setExpandedSubsections] = useState([]);
  const chapterRefs = useRef([]);
  const sectionRefs = useRef({});
  const subsectionRefs = useRef({});
  const headingRefs = useRef({});

  const scrollToChapter = (index) => {
    chapterRefs.current[`chapter-${index}`]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const scrollToSection = (key) => {
    sectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const scrollToSubsection = (key) => {
    subsectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const scrollToHeading = (key) => {
    headingRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const toggleChapterExpansion = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const toggleSectionExpansion = (index) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const toggleSubsectionExpansion = (sectionIndex, subsecIndex) => {
    const key = `${sectionIndex}-${subsecIndex}`; // Create a unique key for subsections
    setExpandedSubsections((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };
  const toggleLockComponent = (
    chapterIndex,
    sectionIndex,
    subsectionIndex,
    componentIndex
  ) => {
    const updatedChapters = chapters.map((chapter, chIndex) => {
      if (chIndex === chapterIndex) {
        const updatedSections = chapter.sections.map((section, secIndex) => {
          if (secIndex === sectionIndex) {
            const updatedSubsections = section.subsections.map(
              (subsection, subIndex) => {
                if (subIndex === subsectionIndex) {
                  const updatedComponents = subsection.components.map(
                    (component, compIndex) => {
                      if (compIndex === componentIndex) {
                        return { ...component, locked: !component.locked };
                      }
                      return component;
                    }
                  );
                  return { ...subsection, components: updatedComponents };
                }
                return subsection;
              }
            );
            return { ...section, subsections: updatedSubsections };
          }
          return section;
        });
        return { ...chapter, sections: updatedSections };
      }
      return chapter;
    });
    console.log(updatedChapters);
    setChapters(updatedChapters); // Update the chapters state
  };

  const renderComponent = (component, chapterIndex, componentIndex) => {
    if (component.locked) {
      return (
        <div className="bg-yellow-100 p-4 border border-yellow-400 rounded">
          <p>This content is locked. Please subscribe to view it.</p>
        </div>
      );
    }

    switch (component.type) {
      case "Text":
        return (
          <p
            className="custom-content"
            dangerouslySetInnerHTML={{ __html: component.content }}
          />
        );
      case "Heading":
        return (
          <h2
            className="text-2xl font-bold"
            dangerouslySetInnerHTML={{ __html: component.content }}
          />
        );
      case "Graph":
        return (
          <CreateGraph
            labels={component.content.labels}
            dataPoints={component.content.dataPoints}
            isEditable={false} // Graph is not editable in preview
          />
        );
      case "Equation":
        return (
          <div className="p-4 border rounded-lg bg-gray-100">
            <BlockMath math={component.content} errorColor={"#cc0000"} />
          </div>
        );
      case "Quiz":
        return renderMCQ(component.content);
      case "FillInTheBlanks":
        return renderFIB(component.content); // Rendering FIB component
      case "Image":
        return (
          <img
            src={component.content}
            alt={component.content.alt}
            className="max-w-full"
          />
        );
      case "Video":
        return (
          <video controls className="max-w-full">
            <source src={component.content.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return null;
    }
  };

  const renderMCQ = (mcq) => {
    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <div className="mb-6 text-center">
          <div
            className="text-2xl font-bold"
            dangerouslySetInnerHTML={{ __html: mcq.question }}
          />
        </div>
        <div className="pl-10">
          {mcq.options.map((option, index) => (
            <div key={index} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name={`option-${index}`}
                  value={option.value}
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2 text-lg">{option.value}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFIB = (fibContent) => {
    const { questions, answers } = fibContent;
    const blanksRegex = /___/g;
    const parts = questions.split(blanksRegex);

    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-wrap text-lg">
          {parts.map((part, index) => (
            <span key={index} className="flex items-center">
              <span dangerouslySetInnerHTML={{ __html: part }} />
              {index < answers.length && (
                <input
                  type="text"
                  className="border-b-2 border-gray-300 mx-2 px-1 focus:outline-none focus:border-blue-500 flex-grow"
                  style={{ minWidth: "100px" }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    );
  };
  const handleBack = () => {
    setIsBook(false);
  };

  const handlePublish = async () => {
    if (book.ispublished === false) {
      const updatedBookInfo = { ...book, ispublished: true }; // Update `ispublished` to true
      console.log(updatedBookInfo);
      try {
        const response = await updatePublish(updatedBookInfo._id, true); // Pass only the ID to the API function
        console.log(response?.status);

        if (response === true) {
          notify("Book successfully published");
          setIsBook(false);

          // Update `bookinfo` in the Redux store with the new state of `ispublished`
          dispatch(useractions.setPublish(updatedBookInfo));
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

  const handleDiscard = async () => {
    try {
      const response = await deleteBook(book._id);
      console.log(response?.status);
      if (response === true) {
        notify("Book deleted successfully");
        setIsBook(false);
      } else {
        notify("Failed to delete book");
      }
    } catch (e) {
      console.error("Error discarding book:", e);
      notify("An error occurred while discarding the book");
    }
  };

  const handleSaveChanges = async () => {
    console.log(chapters);
    try {
      const response = await updateChapters(book._id, chapters); // Use the updated chapters state
      if (response) {
        notify("Book saved successfully");
        // Optionally, you can update Redux or any other state with the saved data
        dispatch(bookactions.updateBookChapters(book._id, chapters));
        setIsBook(false); // Close the admin view if needed
      } else {
        notify("Failed to save chapters");
      }
    } catch (error) {
      console.error("Error saving chapters:", error);
      notify("An error occurred while saving the book");
    }
  };
  function htmlToPlainText(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin: Manage Book Content</h1>
      <div className="flex justify-between mb-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded c"
        >
          Back
        </button>
        <div>
          <button
            onClick={handleSaveChanges}
            className="mr-4 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
          >
            Save Changes
          </button>
          <button
            onClick={handlePublish}
            className="mr-4 px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
          >
            Publish
          </button>
          <button
            onClick={handleDiscard}
            className="mr-4 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
          >
            Delete Book
          </button>
        </div>
      </div>
      {chapters.length === 0 ? (
        <p>No chapters available.</p>
      ) : (
        <div className="flex">
          {/* Chapter List on the left */}
          <div className="lg:w-1/4 bg-white p-4 shadow-md h-full transition-transform duration-300 ">
            <div className="mb-6 flex justify-around flex-col">
              <h2
                className="text-xl font-bold mb-2 text-center"
                dangerouslySetInnerHTML={{ __html: book.booktitle }}
              />
              <p
                dangerouslySetInnerHTML={{ __html: book.description }}
                className="text-center"
              />
              <img
                src={book.image ? book.image : BookCover1}
                className="h-1/2 items-center"
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
                      <span onClick={() => scrollToChapter(index)}>
                        {htmlToPlainText(chapter?.title) ||
                          `Chapter ${index + 1}`}
                      </span>
                    </div>
                  </div>
                  {expandedChapters.includes(index) && (
                    <ul className="pl-6 mt-2">
                      {chapter.sections?.map((section, sectionIndex) => (
                        <li key={section.id}>
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => toggleSectionExpansion(sectionIndex)}
                          >
                            {expandedSections.includes(sectionIndex) ? (
                              <FaChevronDown className="mr-2" />
                            ) : (
                              <FaChevronRight className="mr-2" />
                            )}
                            <span
                              onClick={() =>
                                scrollToSection(
                                  `section-${index}-${sectionIndex}`
                                )
                              }
                            >
                              {htmlToPlainText(section.title) ||
                                `Section ${sectionIndex + 1}`}
                            </span>
                          </div>
                          {expandedSections.includes(sectionIndex) && (
                            <ul className="pl-6 mt-2">
                              {section.subsections?.map(
                                (subsec, subsecIndex) => (
                                  <li key={subsec.id}>
                                    <div
                                      className="flex items-center cursor-pointer"
                                      onClick={() =>
                                        toggleSubsectionExpansion(
                                          sectionIndex,
                                          subsecIndex
                                        )
                                      }
                                    >
                                      {expandedSubsections.includes(
                                        `${sectionIndex}-${subsecIndex}`
                                      ) ? (
                                        <FaChevronDown className="mr-2" />
                                      ) : (
                                        <FaChevronRight className="mr-2" />
                                      )}
                                      <span
                                        onClick={() =>
                                          scrollToSection(
                                            `section-${index}-${sectionIndex}`
                                          )
                                        }
                                      >
                                        {htmlToPlainText(subsec.heading) ||
                                          `Subsection ${subsecIndex + 1}`}
                                      </span>
                                    </div>
                                    {expandedSubsections.includes(
                                      `${sectionIndex}-${subsecIndex}`
                                    ) && (
                                      <div className="pl-6 mt-2">
                                        {subsec.components.map(
                                          (comp, compIndex) => (
                                            <div
                                              key={comp.id}
                                              className="text-left"
                                              onClick={() =>
                                                scrollToHeading(
                                                  `heading-${index}-${sectionIndex}-${subsecIndex}-${compIndex}`
                                                )
                                              }
                                            >
                                              {comp.type === "Heading" &&
                                                htmlToPlainText(comp.content)}
                                            </div>
                                          )
                                        )}
                                      </div>
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
          </div>

          {/* Chapter Content on the right */}
          <div className="lg:w-3/4 p-4 bg-gray-100">
            {chapters.map((chapter, chapterIndex) => (
              <div
                key={chapterIndex}
                className="mb-8 p-4 bg-white shadow-md rounded-lg"
                ref={(el) =>
                  (chapterRefs.current[`chapter-${chapterIndex}`] = el)
                }
              >
                <h2
                  className="text-4xl font-bold mb-4 text-center text-gray-800 border-b pb-2 "
                  dangerouslySetInnerHTML={{ __html: chapter.title }}
                />
                <p
                  className="text-base text-gray-600 mb-4 text-center leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: chapter.summary }}
                />
                {/* Sections and Subsections */}
                {chapter.sections?.map((section, sectionIndex) => (
                  <div
                    key={section.id}
                    className="mt-4 mx-10"
                    ref={(el) =>
                      (sectionRefs.current[
                        `section-${chapterIndex}-${sectionIndex}`
                      ] = el)
                    }
                  >
                    <h3
                      className="text-3xl font-bold mb-2 my-5"
                      style={{ color: "#1C1678" }}
                      dangerouslySetInnerHTML={{
                        __html:
                          section.title ||
                          `${chapterIndex + 1}.${sectionIndex + 1}Section`,
                      }}
                    />
                    <p
                      className="text-base text-gray-600 mb-4 text-justify leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: section.sectionsummary,
                      }}
                    />
                    <div className="space-y-4">
                      {section.subsections?.map((subsec, subsectionIndex) => (
                        <div
                          key={subsec.id}
                          ref={(el) =>
                            (subsectionRefs.current[
                              `subsection-${chapterIndex}-${sectionIndex}-${subsectionIndex}`
                            ] = el)
                          }
                        >
                          <h4
                            className="text-2xl font-semibold my-5"
                            style={{ color: "#1C1678" }}
                            dangerouslySetInnerHTML={{
                              __html:
                                subsec.heading ||
                                `${chapterIndex + 1}.${sectionIndex + 1}.${
                                  subsectionIndex + 1
                                } Subsection`,
                            }}
                          />
                          <p
                            className="text-base text-gray-600 mb-4 text-justify leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: subsec.subsectionsummary,
                            }}
                          />
                          <div>
                            {subsec.components.map(
                              (component, componentIndex) => (
                                <div
                                  key={component.id}
                                  className="mb-4"
                                  ref={(el) =>
                                    (headingRefs.current[
                                      `heading-${chapterIndex}-${sectionIndex}-${subsectionIndex}-${componentIndex}`
                                    ] = el)
                                  }
                                >
                                  {renderComponent(
                                    component,
                                    chapterIndex,
                                    componentIndex
                                  )}

                                  {/* Lock/Unlock button */}
                                  {/* Lock/Unlock button */}
                                  <div className="flex justify-end">
                                    {" "}
                                    {/* Ensure the button is on the right side */}
                                    <button
                                      className={`ml-2 px-3 py-1 text-sm rounded bg-blue-500 text-white`}
                                      onClick={() =>
                                        toggleLockComponent(
                                          chapterIndex,
                                          sectionIndex,
                                          subsectionIndex,
                                          componentIndex
                                        )
                                      }
                                    >
                                      {component.locked ? "Unlock" : "Lock"}
                                    </button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBook;
