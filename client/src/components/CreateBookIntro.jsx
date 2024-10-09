import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { setBookDetails } from "./../store/actions/bookactions";

const CreateBookPage = ({ setIsIntro }) => {
  const dispatch = useDispatch();

  // Retrieve the previous book details from the Redux state
  const bookDetails = useSelector((state) => state.createbook);

  // Local component state initialized with Redux values or empty if not available
  const [bookName, setBookName] = useState(bookDetails?.booktitle || "");
  const [authorName, setAuthorName] = useState(bookDetails?.author || "");
  const [bookCategory, setBookCategory] = useState(bookDetails?.booktype || "");
  const [bookTagline, setBookTagline] = useState(bookDetails?.summary || "");
  const [coverImage, setCoverImage] = useState(bookDetails?.coverImage || null);

  // Update local state when bookDetails changes
  useEffect(() => {
    setBookName(bookDetails?.booktitle || "");
    setAuthorName(bookDetails?.author || "");
    setBookCategory(bookDetails?.booktype || "");
    setBookTagline(bookDetails?.summary || "");
    setCoverImage(bookDetails?.coverImage || null);
  }, [bookDetails]);

  // Handle Cover Image Upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImage(event.target.result); // Display image as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const updatedBookDetails = {
      booktitle: bookName,
      author: authorName,
      booktype: bookCategory,
      summary: bookTagline,
      createdby: "User", // You can replace this with dynamic data if available
      createdat: new Date().toISOString(),
      ispublished: false, // Set it to false by default
      description: "", // Optional: you can add more fields based on user input
      creaters: [], // If there are additional creators, this can be updated
      coverImage, // Add the cover image to the book details
    };

    // Dispatch the action to update book details in the Redux store
    dispatch(setBookDetails(updatedBookDetails));
    setIsIntro((prev) => !prev);
    console.log(updatedBookDetails);
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Create a New Book</h1>

      {/* Book Name */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Book Name</label>
        <SunEditor
          setContents={bookName}
          onChange={(content) => setBookName(content)}
          placeholder="Enter Book Name"
          setOptions={{
            height: 50,
            buttonList: [
              ["font", "fontSize", "bold", "italic", "underline"],
              ["align", "list", "undo", "redo"],
            ],
          }}
        />
      </div>

      {/* Author Name */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Author Name</label>
        <SunEditor
          setContents={authorName}
          onChange={(content) => setAuthorName(content)}
          placeholder="Enter Author Name"
          setOptions={{
            height: 50,
            buttonList: [
              ["font", "fontSize", "bold", "italic", "underline"],
              ["align", "list", "undo", "redo"],
            ],
          }}
        />
      </div>

      {/* Book Category */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Book Category</label>
        <SunEditor
          setContents={bookCategory}
          onChange={(content) => setBookCategory(content)}
          placeholder="Enter Book Category"
          setOptions={{
            height: 50,
            buttonList: [
              ["font", "fontSize", "bold", "italic", "underline"],
              ["align", "list", "undo", "redo"],
            ],
          }}
        />
      </div>

      {/* Book Tagline */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Book Tagline</label>
        <SunEditor
          setContents={bookTagline}
          onChange={(content) => setBookTagline(content)}
          placeholder="Enter Book Tagline"
          setOptions={{
            height: 50,
            buttonList: [
              ["font", "fontSize", "bold", "italic", "underline"],
              ["align", "list", "undo", "redo"],
            ],
          }}
        />
      </div>

      {/* Cover Image Upload */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Cover Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="mb-2"
        />
        {coverImage && (
          <div className="mt-4">
            <img
              src={coverImage}
              alt="Cover Preview"
              className="w-48 h-64 object-cover border rounded-md shadow-md"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

export default CreateBookPage;
