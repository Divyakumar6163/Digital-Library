import React from "react";
import CreateGraph from "./CreateGraph";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const PreviewBook = ({ chapters }) => {
  const renderComponent = (component) => {
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
          <div>
            {/* <h3 className="text-lg font-semibold mb-2">Equation Preview:</h3> */}
            <div className="p-4 border rounded-lg bg-gray-100">
              <BlockMath math={component.content} errorColor={"#cc0000"} />
            </div>
          </div>
        );
      case "Quiz":
        return renderMCQ(component.content);
      case "Fill in the Blanks":
        return renderFIB(component.content); // Rendering FIB component
      case "Image":
        return (
          <div>
            {/* <h3 className="text-lg font-semibold">Image:</h3> */}
            <img
              src={component.content.url}
              alt={component.content.alt}
              className="max-w-full"
            />
          </div>
        );
      case "Video":
        return (
          <div>
            {/* <h3 className="text-lg font-semibold">Video:</h3> */}
            <video controls className="max-w-full">
              <source src={component.content.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMCQ = (mcq) => {
    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        {/* <h3 className="text-xl font-semibold mb-4 text-center">MCQ Preview:</h3> */}
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
                  type="checkbox" // Change from radio to checkbox
                  name={`option-${index}`} // Use a unique name for each option
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
        {/* <h3 className="text-xl font-semibold mb-4 text-center">
          Fill in the Blanks
        </h3> */}
        <div className="flex flex-wrap text-lg">
          {parts.map((part, index) => (
            <span key={index} className="flex items-center">
              <span dangerouslySetInnerHTML={{ __html: part }} />
              {index < answers.length && (
                <input
                  type="text"
                  className="border-b-2 border-gray-300 mx-2 px-1 focus:outline-none focus:border-blue-500 flex-grow"
                  // value={answers[index]}
                  // readOnly
                  style={{ minWidth: "100px" }} // Ensure the input has a minimum width
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
      <h1 className="text-3xl font-bold mb-6">Preview Book</h1>
      {chapters.length === 0 ? (
        <p>No chapters available.</p>
      ) : (
        <div>
          {chapters.map((chapter, index) => (
            <div key={index} className="mb-8 p-4 bg-white shadow-md rounded-lg">
              <h2
                className="text-xl font-bold mb-2"
                dangerouslySetInnerHTML={{ __html: chapter.title }}
              />
              <p
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: chapter.summary }}
              />
              <div>
                {chapter.components.map((component) => (
                  <div key={component.id} className="mb-4">
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewBook;
