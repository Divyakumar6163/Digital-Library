import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const FIBPage = ({
  onChange, // Callback to send questions and answers to parent
  value, // Initial value from parent, containing questions and answers
}) => {
  const [preview, setPreview] = useState(false);
  const blanksRegex = /___/g;

  // Separate useState for questions and answers
  const [questions, setQuestions] = useState(value?.questions || "");
  const [answers, setAnswers] = useState(value?.answers || []);

  useEffect(() => {
    // Extract blanks from the questions and ensure the answers array is in sync with them
    const contentToMatch = typeof questions === "string" ? questions : "";
    const blanksArray = [...contentToMatch.matchAll(blanksRegex)];
    const newAnswers = [...answers]; // Preserve existing answers

    // Adjust the size of the answers array to match the number of blanks
    if (blanksArray.length > answers.length) {
      newAnswers.push(...Array(blanksArray.length - answers.length).fill(""));
    } else if (blanksArray.length < answers.length) {
      newAnswers.splice(blanksArray.length);
    }

    setAnswers(newAnswers);
  }, [questions]);

  // Update parent whenever questions or answers change
  const updateParent = (updatedQuestions, updatedAnswers) => {
    const updatedData = {
      questions: updatedQuestions || questions,
      answers: updatedAnswers || answers,
    };
    onChange(updatedData); // Trigger the parent callback with the updated questions and answers
  };

  // Handle changes in the SunEditor for the question
  const handleEditorChange = (newContent) => {
    setQuestions(newContent);
    updateParent(newContent, answers); // Update parent with the new question content
  };

  // Handle changes in the answer inputs
  const handleInputChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
    updateParent(questions, newAnswers); // Update parent with the new answers
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

  // Updated renderPreview function to replace ___ with <input />
  const renderPreview = () => {
    // Split the question content based on '___' and alternate with input fields
    const parts = questions.split(blanksRegex);

    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        {/* <h3 className="text-xl font-semibold mb-4">Preview:</h3> */}
        <div className="flex flex-wrap text-lg">
          {parts.map((part, index) => (
            <span key={index} className="flex items-center">
              {/* Render the text part */}
              <span dangerouslySetInnerHTML={{ __html: part }} />
              {/* Render input fields in place of '___' */}
              {index < answers.length && (
                <input
                  type="text"
                  className="border-b-2 border-gray-300 mx-2 px-1 focus:outline-none focus:border-blue-500 flex-grow"
                  // value={answers[index]}
                  // readOnly
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
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <SunEditor
          setContents={questions || ""}
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
      </div>
      {preview && renderPreview()}
    </div>
  );
};

export default FIBPage;
