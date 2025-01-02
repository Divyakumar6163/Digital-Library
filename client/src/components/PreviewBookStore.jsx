import React, { useState, useRef } from "react";
import CreateGraph from "./CreateBookComponents/CreateGraph";
import { BlockMath } from "react-katex";
import BookCover1 from "../image/NoImage.jpg";
import "katex/dist/katex.min.css";
import { FaChevronRight, FaChevronDown, FaChevronLeft } from "react-icons/fa"; // Import icons
import { useSelector } from "react-redux";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

const PreviewBook = ({ bookinfo, chapters, ispre }) => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandedSubsections, setExpandedSubsections] = useState([]);
  const userState = useSelector((state) => state.user);
  const chapterRefs = useRef([]);
  const sectionRefs = useRef({});
  const subsectionRefs = useRef({});
  const headingRefs = useRef({});

  const scrollToChapter = (index) => {
    setCurrentChapterIndex(index);
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
  const renderComponent = (component) => {
    // Check if the content is locked
    if (component.locked && userState.userinfo.ispreminum !== true) {
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
            className="text-sm custom-content"
            dangerouslySetInnerHTML={{ __html: component.content }}
          />
        );

      case "Heading":
        return (
          <h2
            className="text-xl font-bold my-3"
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
  function htmlToPlainText(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };
  const currentChapter = chapters[currentChapterIndex];
  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 bg-gray-100 relative">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white p-4 shadow-md h-full transition-transform duration-300">
        {/* Sidebar Content */}
        <div className="mb-6 flex justify-around flex-col">
          <h2
            className="text-xl font-bold mb-2 text-center"
            dangerouslySetInnerHTML={{ __html: bookinfo.booktitle }}
          />
          <p
            dangerouslySetInnerHTML={{ __html: bookinfo.description }}
            className="text-center"
          />
          <img
            src={bookinfo.image ? bookinfo.image : BookCover1}
            className="items-center"
            style={{ width: "40%" }}
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
                    {htmlToPlainText(chapter?.title) || `Chapter ${index + 1}`}
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
                              `section-${currentChapterIndex}-${sectionIndex}`
                            )
                          }
                        >
                          {htmlToPlainText(section.title) ||
                            `Section ${sectionIndex + 1}`}
                        </span>
                      </div>
                      {expandedSections.includes(sectionIndex) && (
                        <ul className="pl-6 mt-2">
                          {section.subsections?.map((subsec, subsecIndex) => (
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
                                    scrollToSubsection(
                                      `subsection-${currentChapterIndex}-${sectionIndex}-${subsecIndex}`
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
                                  {subsec.components.map((comp, compIndex) => (
                                    <div
                                      key={comp.id}
                                      className="text-left"
                                      onClick={() =>
                                        scrollToHeading(
                                          `heading-${currentChapterIndex}-${sectionIndex}-${subsecIndex}-${compIndex}`
                                        )
                                      }
                                    >
                                      {comp.type === "Heading" &&
                                        htmlToPlainText(comp.content)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
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

      {/* Main Content */}
      <div className="w-full lg:w-3/4 bg-gray-50 p-4 lg:p-6 space-y-6">
        {currentChapter && (
          <div className="w-full bg-white shadow-lg rounded-lg p-6">
            {/* Chapter Title */}
            <h1
              className="text-4xl font-bold mb-4 text-center text-gray-800 border-b pb-2"
              dangerouslySetInnerHTML={{ __html: currentChapter.title }}
            />
            {/* Chapter Summary */}
            <p
              className="text-base text-gray-600 mb-4 text-center leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentChapter.summary }}
            />

            {/* Sections and Subsections */}
            {currentChapter.sections?.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="mt-4 mx-10"
                ref={(el) =>
                  (sectionRefs.current[
                    `section-${currentChapterIndex}-${sectionIndex}`
                  ] = el)
                }
              >
                <h3
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#1C1678" }}
                  dangerouslySetInnerHTML={{ __html: section.title }}
                />
                <p
                  className="text-base text-gray-600 mb-4 text-justify leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: section.sectionsummary,
                  }}
                />
                <div className="space-y-4">
                  {section.components.map((comp) => (
                    <div key={comp.id} className="text-left">
                      {renderComponent(comp)}
                    </div>
                  ))}
                  {section.subsections?.map((subsec, subsectionIndex) => (
                    <div
                      key={subsec.id}
                      ref={(el) =>
                        (subsectionRefs.current[
                          `subsection-${currentChapterIndex}-${sectionIndex}-${subsectionIndex}`
                        ] = el)
                      }
                    >
                      <h4
                        className="text-2xl font-semibold my-5"
                        style={{ color: "#1C1678" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            subsec.heading ||
                            `${currentChapterIndex + 1}.${sectionIndex + 1}.${
                              subsectionIndex + 1
                            } Section`,
                        }}
                      />
                      <div className="space-y-2">
                        {subsec.components.map((comp, compIndex) => (
                          <div
                            key={comp.id}
                            className="text-left"
                            ref={(el) =>
                              (headingRefs.current[
                                `heading-${currentChapterIndex}-${sectionIndex}-${subsectionIndex}-${compIndex}`
                              ] = el)
                            }
                          >
                            {renderComponent(comp)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center p-4 bg-white shadow-md">
          {/* Previous Chapter Button */}
          {currentChapterIndex !== 0 ? (
            <button
              onClick={handlePreviousChapter}
              className="flex items-center text-blue-500 hover:underline disabled:opacity-50"
            >
              <FaArrowCircleLeft className="text-4xl ml-4" />
            </button>
          ) : (
            <div className="flex-grow" />
          )}

          {/* Next Chapter Button */}
          {currentChapterIndex !== chapters.length - 1 && (
            <button
              onClick={handleNextChapter}
              className="flex items-center text-blue-500 hover:underline disabled:opacity-50"
            >
              <FaArrowCircleRight className="text-4xl mr-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewBook;
