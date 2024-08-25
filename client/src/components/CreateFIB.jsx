import React, { useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const FIBPage = () => {
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState("");
  const blanksRegex = /___/g;
  const [inputs, setInputs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const handlePreview = () => {
    setPreview(!preview);
  };
  const handleEditorChange = (content) => {
    setContent(content);
    const blanksArray = [...content.matchAll(blanksRegex)];
    setInputs(Array(blanksArray.length).fill(""));
    setAnswers(Array(blanksArray.length).fill(""));
  };
  const handleChange = (e, index) => {
    const newInputs = [...inputs];
    newInputs[index] = e.target.value;
    setInputs(newInputs);
  };

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };
  const renderSentenceWithInputs = () => {
    const parts = content.split(blanksRegex);

    return (
      <div>
        {parts.map((part, index) => (
          <span key={index}>
            <span dangerouslySetInnerHTML={{ __html: part }} />
            {index < inputs.length && (
              <input
                type="text"
                className="border-b-2 border-gray-300 mx-2 px-1 focus:outline-none focus:border-blue-500"
                value={inputs[index]}
                onChange={(e) => handleChange(e, index)}
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
              onChange={(e) => handleAnswerChange(e, index)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      {/* <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Create Fill in the Blanks
      </h2> */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <SunEditor
          setContents={content}
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
      <div className="flex justify-center">
        <button
          onClick={handlePreview}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300"
        >
          {!preview ? "Preview" : "Close"}
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
