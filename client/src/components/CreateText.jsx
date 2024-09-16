import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useDispatch, useSelector } from "react-redux";
import { setText } from "../store/reducers/textSlice"; // Assuming you have created textSlice.js

const TextEditorWithPreview = () => {
  const dispatch = useDispatch();
  const textFromStore = useSelector((state) => state.text.content);

  const [text, setLocalText] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [backupText, setBackupText] = useState("");

  // Sync local text with the Redux store when the component mounts
  useEffect(() => {
    setLocalText(textFromStore);
    setBackupText(textFromStore);
  }, [textFromStore]);

  const togglePreview = () => {
    setIsPreview(!isPreview);
    if (!isPreview) {
      setBackupText(text); // Save the current text as a backup before previewing
    }
  };

  const handleSave = () => {
    dispatch(setText(text)); // Save text to Redux store
    setIsPreview(true);
  };

  const handleEdit = () => {
    setIsPreview(false);
  };

  const handleCancel = () => {
    setLocalText(backupText); // Restore the text to its previous state
    setIsPreview(true);
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
            setContents={text}
            onChange={setLocalText} // Update local state on change
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-white p-2 border rounded-lg shadow-sm hover:bg-gray-200 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-2 border rounded-lg bg-gray-100">
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </div>
          <div className="flex justify-end mt-2 space-x-2">
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

export default TextEditorWithPreview;
