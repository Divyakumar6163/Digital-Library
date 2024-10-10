import React, { useState } from "react";
import CreateGraph from "./CreateGraph";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import icons

const initialChapters = [
  {
    title: "Chapter 1: Introduction to Knowledge",
    summary:
      "This chapter provides an introduction to knowledge and its importance in various fields.",
    components: [
      {
        id: 1,
        type: "Heading",
        content: "What is Knowledge?",
        locked: false,
      },
      {
        id: 2,
        type: "Text",
        content:
          "Knowledge is the awareness and understanding of facts, truths, or information gained through experience or education.",
        locked: false,
      },
      {
        id: 3,
        type: "Image",
        content: {
          url: "https://via.placeholder.com/300",
          alt: "Placeholder image about knowledge",
        },
        locked: false,
      },
      {
        id: 4,
        type: "Quiz",
        content: {
          question: "Which of the following is a source of knowledge?",
          options: [
            { value: "Books" },
            { value: "TV shows" },
            { value: "Social media" },
            { value: "All of the above" },
          ],
        },
        locked: true, // This quiz is locked
      },
    ],
  },
  {
    title: "Chapter 2: Advanced Concepts in Knowledge",
    summary: "This chapter explores deeper into the concepts of knowledge.",
    components: [
      {
        id: 5,
        type: "Heading",
        content: "Types of Knowledge",
        locked: false,
      },
      {
        id: 6,
        type: "Text",
        content:
          "There are various types of knowledge including empirical, rational, and tacit knowledge.",
        locked: false,
      },
      {
        id: 7,
        type: "Equation",
        content: "E = mc^2",
        locked: true, // This equation is locked
      },
      {
        id: 8,
        type: "Video",
        content: {
          url: "https://www.example.com/sample-video.mp4",
        },
        locked: false,
      },
    ],
  },
  {
    title: "Chapter 3: Interactive Knowledge",
    summary:
      "This chapter focuses on interactive methods of acquiring knowledge.",
    components: [
      {
        id: 9,
        type: "Heading",
        content: "Interactive Learning",
        locked: false,
      },
      {
        id: 10,
        type: "Graph",
        content: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          dataPoints: [10, 20, 30, 40, 50],
        },
        locked: true, // This graph is locked
      },
      {
        id: 11,
        type: "Fill in the Blanks",
        content: {
          questions: "Knowledge is ___ and understanding is ___.",
          answers: ["power", "key"],
        },
        locked: false,
      },
    ],
  },
];

const AdminBook = ({ isSubscribed }) => {
  const [chapters, setChapters] = useState(initialChapters); // Store chapters in state
  const [expandedChapters, setExpandedChapters] = useState([]);

  const toggleChapterExpansion = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleLockComponent = (chapterIndex, componentIndex) => {
    const updatedChapters = chapters.map((chapter, chIndex) => {
      if (chIndex === chapterIndex) {
        const updatedComponents = chapter.components.map(
          (component, compIndex) => {
            if (compIndex === componentIndex) {
              return { ...component, locked: !component.locked };
            }
            return component;
          }
        );
        return { ...chapter, components: updatedComponents };
      }
      return chapter;
    });

    setChapters(updatedChapters); // Update the chapters state
  };

  const renderComponent = (component, chapterIndex, componentIndex) => {
    if (component.locked && !isSubscribed) {
      return (
        <div className="bg-yellow-100 p-4 border border-yellow-400 rounded">
          <p>This content is locked. Please subscribe to view it.</p>
        </div>
      );
    }

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
      case "Fill in the Blanks":
        return renderFIB(component.content); // Rendering FIB component
      case "Image":
        return (
          <img
            src={component.content.url}
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
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin: Manage Book Content</h1>
      {chapters.length === 0 ? (
        <p>No chapters available.</p>
      ) : (
        <div className="flex">
          {/* Chapter List on the left */}
          <div className="lg:w-1/4 bg-white p-4 shadow-md h-full transition-transform duration-300">
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
          <div className="lg:w-3/4 p-4 bg-gray-100">
            {chapters.map((chapter, chapterIndex) => (
              <div
                key={chapterIndex}
                className="mb-8 p-4 bg-white shadow-md rounded-lg"
              >
                <h2
                  className="text-xl font-bold mb-2"
                  dangerouslySetInnerHTML={{ __html: chapter.title }}
                />
                <p
                  className="mb-4"
                  dangerouslySetInnerHTML={{ __html: chapter.summary }}
                />
                <div>
                  {chapter.components.map((component, componentIndex) => (
                    <div key={component.id} className="mb-4">
                      {renderComponent(component, chapterIndex, componentIndex)}

                      {/* Lock/Unlock button */}
                      {/* Lock/Unlock button */}
                      <div className="flex justify-end">
                        {" "}
                        {/* Ensure the button is on the right side */}
                        <button
                          className={`ml-2 px-3 py-1 text-sm rounded bg-blue-500 text-white`}
                          onClick={() =>
                            toggleLockComponent(chapterIndex, componentIndex)
                          }
                        >
                          {component.locked ? "Unlock" : "Lock"}
                        </button>
                      </div>
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

export default AdminBook;
