import React, { useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const MCQPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, value: "" }]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [preview, setPreview] = useState(false);

  // Handle changes in the SunEditor for the question
  const handleQuestionChange = (content) => {
    setQuestion(content);
  };

  // Handle changes in option inputs
  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index].value = e.target.value;
    setOptions(newOptions);
  };

  // Add a new option
  const addOption = () => {
    setOptions([...options, { id: options.length + 1, value: "" }]);
  };

  // Remove an option
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    // If the removed option was the correct answer, reset the correct answer
    if (index === correctAnswer) {
      setCorrectAnswer(null);
    }
  };

  // Handle selecting the correct answer
  const handleAnswerSelection = (index) => {
    setCorrectAnswer(index);
  };

  // Toggle preview mode
  const handlePreview = () => {
    setPreview(!preview);
  };

  // Function to render option inputs
  const renderOptions = () => {
    return options.map((option, index) => (
      <div key={option.id} className="mb-2 flex items-center">
        <input
          type="text"
          className="border-b-2 border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500 rounded-lg w-full"
          placeholder={`Option ${index + 1}`}
          value={option.value}
          onChange={(e) => handleOptionChange(e, index)}
        />
        <button
          type="button"
          className={`ml-4 px-3 py-1 rounded-lg ${
            correctAnswer === index
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-800"
          }`}
          onClick={() => handleAnswerSelection(index)}
        >
          {correctAnswer === index ? "Correct" : "Set as Correct"}
        </button>
        {options.length > 1 && (
          <button
            type="button"
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg"
            onClick={() => removeOption(index)}
          >
            Remove
          </button>
        )}
      </div>
    ));
  };

  // Function to render the question and options in preview mode
  const renderPreview = () => {
    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Preview:</h3>
        <div
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: question }}
        ></div>
        <ul className="list-disc pl-5">
          {options.map((option, index) => (
            <li key={option.id} className="mb-2">
              {option.value}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Create Multiple Choice Question
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Question:</h3>
        <SunEditor
          setContents={question}
          onChange={handleQuestionChange}
          height="200px"
          placeholder="Type your question here."
          setOptions={{
            buttonList: [
              ["undo", "redo"],
              ["font", "fontSize", "formatBlock"],
              ["bold", "underline", "italic", "strike"],
              ["fontColor", "hiliteColor", "textStyle"],
              ["removeFormat"],
              "/", // Line break
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "table"],
              ["link", "image", "video", "audio"],
              ["fullScreen", "showBlocks", "codeView"],
              ["preview", "print"],
            ],
          }}
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Options:</h3>
        {renderOptions()}
        <button
          type="button"
          className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300"
          onClick={addOption}
        >
          Add Option
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handlePreview}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300"
        >
          {!preview ? "Preview" : "Close Preview"}
        </button>
      </div>
      {preview && renderPreview()}
    </div>
  );
};

export default MCQPage;
