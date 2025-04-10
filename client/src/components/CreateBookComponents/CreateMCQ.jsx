import React, { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const MCQPage = ({ value, onChange }) => {
  const [question, setQuestion] = useState(value?.question || "");
  const [options, setOptions] = useState(
    value?.options || [{ id: 1, value: "" }]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    value?.correctAnswer || null
  );
  const [preview, setPreview] = useState(false);

  // Function to trigger the onChange prop with updated state
  const updateParent = (updatedValues) => {
    const newData = {
      question,
      options,
      correctAnswer,
      ...updatedValues,
    };
    onChange(newData);
  };

  useEffect(() => {
    updateParent();
  }, []);

  const handleQuestionChange = (content) => {
    setQuestion(content);
    updateParent({ question: content });
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index].value = e.target.value;
    setOptions(newOptions);
    updateParent({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...options, { id: options.length + 1, value: "" }];
    setOptions(newOptions);
    updateParent({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    let newCorrectAnswer = correctAnswer;
    if (index === correctAnswer) {
      newCorrectAnswer = null;
      setCorrectAnswer(null);
    }

    updateParent({ options: newOptions, correctAnswer: newCorrectAnswer });
  };

  const handleAnswerSelection = (index) => {
    setCorrectAnswer(index);
    updateParent({ correctAnswer: index });
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

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

  const renderPreview = () => {
    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        {/* <h3 className="text-xl font-semibold mb-4 text-center">Preview:</h3> */}
        <div className="mb-6 text-center">
          <div
            className="text-2xl font-bold"
            dangerouslySetInnerHTML={{ __html: question }}
          ></div>
        </div>
        <div className="pl-10">
          {options.map((option, index) => (
            <div key={option.id} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox" // Change from radio to checkbox
                  name={`option-${option.id}`} // Use a unique name for each option
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

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
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
          {!preview ? "Preview" : "Close"}
        </button>
      </div>
      {preview && renderPreview()}
    </div>
  );
};

export default MCQPage;
