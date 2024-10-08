import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const FIBPage = ({
  initialContent = "",
  initialAnswers = [],
  onContentChange,
  onAnswersChange,
  onSave, // Add a callback for saving
}) => {
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState(initialContent);
  const blanksRegex = /___/g;
  const [answers, setAnswers] = useState(initialAnswers);

  useEffect(() => {
    const contentToMatch = typeof content === "string" ? content : ""; // Ensure content is a string
    const blanksArray = [...contentToMatch.matchAll(blanksRegex)];
    const newAnswers = [...answers]; // Preserve existing answers

    // Adjust the size of the answers array to match the number of blanks
    if (blanksArray.length > answers.length) {
      newAnswers.push(...Array(blanksArray.length - answers.length).fill(""));
    } else if (blanksArray.length < answers.length) {
      newAnswers.splice(blanksArray.length);
    }

    setAnswers(newAnswers);
  }, [content]);

  const handleEditorChange = (newContent) => {
    const contentToMatch = typeof newContent === "string" ? newContent : ""; // Ensure newContent is a string
    setContent(contentToMatch);

    // Notify parent component of content change
    if (onContentChange) {
      onContentChange(contentToMatch);
    }
  };

  const handleInputChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);

    // Notify parent component of answers change
    if (onAnswersChange) {
      onAnswersChange(newAnswers);
    }
  };

  const handleSave = () => {
    // Notify parent component with both content and answers
    if (onSave) {
      onSave({ content, answers });
    }
  };

  const renderSentenceWithInputs = () => {
    const parts = content.split(blanksRegex);

    return (
      <div>
        {parts.map((part, index) => (
          <span key={index}>
            <span dangerouslySetInnerHTML={{ __html: part }} />
            {index < answers.length && (
              <input
                type="text"
                className="border-b-2 border-gray-300 mx-2 px-1 focus:outline-none focus:border-blue-500"
                value={answers[index]} // Display answers in preview
                onChange={(e) => handleInputChange(e, index)} // Allow changes
              />
            )}
          </span>
        ))}
      </div>
    );
  };

  const renderAnswerInputs = () => {
    return (
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Provide Answers:</h3>
        {answers.map((answer, index) => (
          <div key={index} className="mb-2">
            <label className="mr-2">Answer {index + 1}:</label>
            <input
              type="text"
              className="border-b-2 border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500 rounded-lg w-full"
              value={answer}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <SunEditor
          setContents={content || ""}
          onChange={handleEditorChange}
          height="300px"
          placeholder="Type your sentence here. Use '___' for blanks."
          setOptions={{
            buttonList: [
              ["undo", "redo"],
              ["font", "fontSize", "formatBlock"],
              ["bold", "underline", "italic", "strike"],
              ["fontColor", "hiliteColor", "textStyle"],
              ["removeFormat"],
              "/",
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "table"],
              ["link", "image", "video", "audio"],
              ["fullScreen", "showBlocks", "codeView"],
              ["preview", "print"],
            ],
          }}
        />
      </div>
      {renderAnswerInputs()}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setPreview(!preview)}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300"
        >
          {!preview ? "Preview" : "Close"}
        </button>
        <button
          onClick={handleSave}
          className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300"
        >
          Save
        </button>
      </div>
      {preview && (
        <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Preview:</h3>
          {renderSentenceWithInputs()}
        </div>
      )}
    </div>
  );
};

export default FIBPage;
