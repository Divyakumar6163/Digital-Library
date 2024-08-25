import React, { useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const TextEditorWithPreview = () => {
  const [text, setText] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="mb-4 p-2 border rounded-lg">
      {!isPreview ? (
        <>
          <SunEditor
            lang="en"
            placeholder="Add Summary"
            setOptions={{
              height: 150,
              buttonList: [
                ["font", "fontSize", "formatBlock"],
                ["bold", "italic", "underline", "strike"],
                ["align", "list", "table"],
                ["undo", "redo"],
                ["codeView"],
              ],
            }}
            setContents={text}
            onChange={setText}
          />
          <button
            onClick={togglePreview}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Preview
          </button>
        </>
      ) : (
        <>
          <div
            className="p-2 border rounded-lg"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          <button
            onClick={togglePreview}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default TextEditorWithPreview;
