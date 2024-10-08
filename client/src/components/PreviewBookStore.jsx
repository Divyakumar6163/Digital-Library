import React from "react";
import CreateGraph from "./CreateGraph";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css"; // Ensure you have the required CSS for rendering LaTeX

const PreviewBook = ({ chapters }) => {
  const renderComponent = (component) => {
    console.log(component.content);
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
            <h3 className="text-lg font-semibold mb-2">Equation Preview:</h3>
            <div className="p-4 border rounded-lg bg-gray-100">
              <BlockMath math={component.content} errorColor={"#cc0000"} />
            </div>
          </div>
        );
      case "Quiz":
        return renderMCQ(component.content);
      case "FIB":
        return renderFIB(component.content);
      case "Image":
        return (
          <div>
            <h3 className="text-lg font-semibold">Image:</h3>
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
            <h3 className="text-lg font-semibold">Video:</h3>
            <video controls className="max-w-full">
              <source src={component.content.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      // Other cases like Fill in the Blanks, etc.
      default:
        return null;
    }
  };
  console.log(chapters.content);

  const renderMCQ = (mcq) => {
    console.log(mcq);
    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">MCQ Preview:</h3>
        <div className="mb-6 text-center">
          <div
            className="text-2xl font-bold"
            dangerouslySetInnerHTML={{ __html: mcq.question }}
          ></div>
        </div>
        <div className="pl-10">
          {mcq.options.map((option, index) => (
            <div key={index} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="mcq"
                  value={option.value}
                  className="form-radio text-blue-600"
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
    const { content, answers } = fibContent;
    const blanksRegex = /___/g;
    const parts = content.split(blanksRegex);

    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">FIB Preview:</h3>
        <div>
          {parts.map((part, index) => (
            <span key={index}>
              <span dangerouslySetInnerHTML={{ __html: part }} />
              {index < answers.length && (
                <input
                  type="text"
                  className="border-b-2 border-gray-300 mx-2 px-1 focus:outline-none focus:border-blue-500"
                  value={answers[index]} // Display the provided answers in preview
                  readOnly
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
