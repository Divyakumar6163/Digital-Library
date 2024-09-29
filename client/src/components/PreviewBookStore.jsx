import React from "react";
import CreateGraph from "./CreateGraph";

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
            <h3>Equation:</h3>
            <p>{component.content}</p>
          </div>
        );
      // Other cases like Quiz, Fill in the Blanks, etc.
      default:
        return null;
    }
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
                dangerouslySetInnerHTML={{ __html: chapter.title }}
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
