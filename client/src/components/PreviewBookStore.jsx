import React, { useState } from "react";
import CreateGraph from "./CreateGraph";
import { BlockMath } from "react-katex";
import BookCover1 from "../image/BookCover1.png";
import "katex/dist/katex.min.css";
import { FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import icons
import { useSelector } from "react-redux";
const PreviewBook = ({ bookinfo, chapters, ispre }) => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const userState = useSelector((state) => state.user);
  const toggleChapterExpansion = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
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

    // Render component based on type if not locked
    switch (component.type) {
      case "Text":
        return <p dangerouslySetInnerHTML={{ __html: component.content }} />;
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

  return (
    <div className="flex justify-center bg-gray-100 relative flex-col sm:flex-col ">
      {ispre ? (
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
          Preview Book
        </h1>
      ) : (
        ""
      )}
      {chapters.length === 0 ? (
        <p className="text-lg text-gray-500 italic text-center">
          No chapters available.
        </p>
      ) : (
        // Render chapters here

        <div className="flex flex-col sm:flex-row">
          {/* Chapter List on the left */}
          <div className="lg:w-1/4 bg-white p-4 shadow-md h-full transition-transform duration-300 ">
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
                      <span>{chapter?.title || `Chapter ${index + 1}`}</span>
                    </div>
                  </div>
                  {expandedChapters.includes(index) && (
                    <ul className="pl-6 mt-2">
                      {chapter.components
                        .filter((comp) => comp.type === "Heading")
                        .map((comp) => (
                          <li key={comp.id}>
                            {comp.content.replace(/<[^>]+>/g, "")}{" "}
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Chapter Content on the right */}
          <div className="sm:w-3/4 bg-gray-50 flex flex-col items-start justify-start space-y-6">
            {chapters.map((chapter, index) => (
              <div
                key={index}
                className="w-full p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Chapter Title */}
                <h2
                  className="text-2xl font-bold mb-4 text-center text-gray-800 border-b pb-2 "
                  dangerouslySetInnerHTML={{ __html: chapter.title }}
                />

                {/* Chapter Summary */}
                <p
                  className="text-base text-gray-600 mb-4 text-center leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: chapter.summary }}
                />

                {/* Chapter Components */}
                <div className="space-y-4">
                  {chapter.components.map((component) => (
                    <div key={component.id} className="text-left">
                      {renderComponent(component)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewBook;
