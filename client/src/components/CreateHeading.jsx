import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const HeadingEditorWithPreview = ({ value, onChange }) => {
  const [heading, setHeading] = useState(value || ""); // Initialize heading from the prop
  const [backupHeading, setBackupHeading] = useState(value || "");
  const [isPreview, setIsPreview] = useState(false);

  // Sync with the incoming value prop
  useEffect(() => {
    setHeading(value || "");
    setBackupHeading(value || "");
  }, [value]);

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleSave = () => {
    setBackupHeading(heading);
    setIsPreview(true);
    if (onChange) {
      onChange(heading); // Notify parent of the updated heading
    }
  };

  const handleCancel = () => {
    setHeading(backupHeading);
    setIsPreview(true);
  };

  return (
    <div className="mb-4 p-2 border rounded-lg">
      {!isPreview ? (
        <>
          <SunEditor
            lang="en"
            placeholder="Enter heading..."
            setOptions={{
              height: 50,
              buttonList: [
                ["font", "fontSize", "formatBlock"],
                ["bold", "italic", "underline", "strike"],
                ["align", "list"],
                ["undo", "redo"],
                ["codeView"],
              ],
              fontSize: [
                "12px",
                "14px",
                "16px",
                "18px",
                "20px",
                "24px",
                "30px",
                "36px",
                "48px",
                "60px",
                "72px",
              ],
              formatBlock: ["H1", "H2", "H3", "H4", "H5", "H6"],
            }}
            setContents={heading}
            onChange={setHeading}
          />
          <button
            onClick={togglePreview}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Preview
          </button>
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className="p-2 border-b rounded-lg"
            dangerouslySetInnerHTML={{ __html: heading }}
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

export default HeadingEditorWithPreview;
