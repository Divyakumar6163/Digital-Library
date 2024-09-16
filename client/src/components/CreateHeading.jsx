import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useDispatch, useSelector } from "react-redux";
import { setHeading } from "../store/reducers/headingSlice"; // Assuming you have this file created

const HeadingEditorWithPreview = () => {
  const dispatch = useDispatch();
  const headingFromStore = useSelector((state) => state.heading.content);

  const [heading, setLocalHeading] = useState("");
  const [backupHeading, setBackupHeading] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setLocalHeading(headingFromStore);
    setBackupHeading(headingFromStore);
  }, [headingFromStore]);

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleSave = () => {
    setBackupHeading(heading);
    dispatch(setHeading(heading)); // Save heading to Redux store
    setIsPreview(true);
  };

  const handleEdit = () => {
    setIsPreview(false);
  };

  const handleCancel = () => {
    setLocalHeading(backupHeading); // Revert changes locally
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
            onChange={setLocalHeading} // Update local state
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
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleEdit}
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
