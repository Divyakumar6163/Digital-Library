import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const HeadingEditorWithPreview = ({ value, onChange }) => {
  const [heading, setHeading] = useState(value || "");
  const [backupHeading, setBackupHeading] = useState(value || "");
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setHeading(value || "");
    setBackupHeading(value || "");
  }, [value]);

  const togglePreview = () => {
    setIsPreview(!isPreview);
    if (!isPreview) {
      setBackupHeading(heading); // Restore previous saved value on edit toggle
    }
  };

  const handleSave = () => {
    setBackupHeading(heading); // Save the current value as backup
    setIsPreview(true);
    if (onChange) {
      onChange(heading); // Notify parent of the updated value
    }
  };

  const handleCancel = () => {
    setHeading(backupHeading); // Restore the text to its last saved state
    setIsPreview(true); // Switch back to preview mode
  };

  return (
    <div className="mb-4 p-2 border rounded-lg">
      {!isPreview ? (
        <>
          <SunEditor
            lang="en"
            placeholder="Enter heading..."
            setOptions={{
              height: 150,
              buttonList: [
                ["undo", "redo"],
                ["font", "fontSize", "formatBlock"],
                ["paragraphStyle", "blockquote"],
                ["bold", "underline", "italic", "strike"],
                ["fontColor", "hiliteColor", "textStyle"],
                ["removeFormat"],
                ["outdent", "indent"],
                ["align", "horizontalRule", "list", "lineHeight"],
                ["table", "link", "image", "video", "audio"],
                ["fullScreen", "showBlocks", "codeView", "preview"],
                ["print", "save", "template"],
              ],
            }}
            setContents={heading}
            onChange={setHeading}
          />
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
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={togglePreview}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HeadingEditorWithPreview;
