import React, { useState } from "react";

const CreateMCQ = ({ value, onChange }) => {
  const [questions, setQuestions] = useState(value?.questions || []);

  const handleQuestionChange = (index, newQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = newQuestion;
    setQuestions(updatedQuestions);
    onChange({ questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", ""], // Two default options for a new question
      answer: null,
    };
    setQuestions([...questions, newQuestion]);
    onChange({ questions: [...questions, newQuestion] });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    onChange({ questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, newOption) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = newOption;
    setQuestions(updatedQuestions);
    onChange({ questions: updatedQuestions });
  };

  const handleAnswerChange = (questionIndex, newAnswer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answer = newAnswer;
    setQuestions(updatedQuestions);
    onChange({ questions: updatedQuestions });
  };

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-4">Multiple Choice Questions</h3>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <input
            type="text"
            className="w-full mb-2 p-2 border rounded-lg"
            placeholder={`Question ${index + 1}`}
            value={question.question}
            onChange={(e) =>
              handleQuestionChange(index, {
                ...question,
                question: e.target.value,
              })
            }
          />
          <div className="mb-2">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex mb-2">
                <input
                  type="text"
                  className="flex-grow p-2 border rounded-lg"
                  placeholder={`Option ${optIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, optIndex, e.target.value)
                  }
                />
                <button
                  onClick={() => handleAnswerChange(index, optIndex)}
                  className={`ml-2 p-2 border rounded-lg ${
                    question.answer === optIndex ? "bg-green-500" : ""
                  }`}
                >
                  {question.answer === optIndex ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => deleteQuestion(index)}
            className="text-red-500"
          >
            Delete Question
          </button>
        </div>
      ))}
      <button
        onClick={addQuestion}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        Add Question
      </button>
    </div>
  );
};

export default CreateMCQ;
