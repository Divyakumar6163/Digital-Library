import React, { useState } from "react";

// The sentence with blanks
const sentence = "The ___ jumped over the ___ dog.";

const FillInTheBlanks = () => {
  // Use regex to match all instances of '___' in the sentence
  const blanksRegex = /___/g;
  const blanksArray = [...sentence.matchAll(blanksRegex)];

  // Initialize state for the inputs, with an array the same length as the number of blanks
  const [inputs, setInputs] = useState(Array(blanksArray.length).fill(""));

  // Handle changes in input fields
  const handleChange = (e, index) => {
    const newInputs = [...inputs];
    newInputs[index] = e.target.value;
    setInputs(newInputs);
  };

  console.log(inputs);
  // Function to render the sentence with input fields
  const renderSentence = () => {
    // Split the sentence into parts: before, between, and after the blanks
    const parts = sentence.split(blanksRegex);

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < blanksArray.length && (
              <input
                type="text"
                className="border-b-2 border-gray-300 mx-2 px-1 focus:outline-none focus:border-blue-500"
                value={inputs[index]}
                onChange={(e) => handleChange(e, index)}
              />
            )}
          </span>
        ))}
      </>
    );
  };

  return <p>{renderSentence()}</p>;
};

export default FillInTheBlanks;
