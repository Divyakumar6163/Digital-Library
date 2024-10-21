import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { setBookDetails } from "./../store/actions/bookactions";
import { createBook } from "../API/createbook";
import { useLoader } from "../store/utils/loaderprovider";
import axios from "axios";
import * as useractions from "./../store/actions/bookactions";
import { notify } from './../store/utils/notify'
import { useNavigate } from "react-router";
import { Createbookloader } from "../store/utils/createbookloader";
const CreateBookPage = ({ setIsIntro }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loader = useLoader()
  const bookDetails = useSelector((state) => state.createbook);
  const [bookName, setBookName] = useState(bookDetails?.booktitle || "");
  const [authorName, setAuthorName] = useState(bookDetails?.author || "");
  const [description, setdescription] = useState(bookDetails?.description || "");
  const [bookTagline, setBookTagline] = useState(bookDetails?.summary || "");
  const [tags, setTags] = useState(bookDetails?.tags || []);
  const [tagInputValue, setTagInputValue] = useState("");
  const accessToken = useSelector((state) => state.auth.accessToken);
  // const [coverImage, setCoverImage] = useState(bookDetails?.coverImage || null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [createBookstate, setCreateBookstate] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setImageFile(file); // Store the file in state

    // For image preview
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  // const handleUpload = async () => {
  //   if (!imageFile) {
  //     alert("Please select an image to upload!");
  //     return;
  //   }

  //   const formData = new FormData(); 
  //   formData.append('image', imageFile); 

  //   try {
  //     const response = await axios.post('http://localhost:5000/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data', 
  //       },
  //     });

  //     setUploadResponse(response.data); 
  //     alert('File uploaded successfully!');
  //     console.log(response.data);

  //   } catch (error) {
  //     console.error("There was an error uploading the image:", error);
  //     alert("Error uploading file!");
  //   }
  // };

  const handleInputChange = (e) => {
    setTagInputValue(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag(tagInputValue);
    }
  };
  const handleBlur = () => {
    addTag(tagInputValue);
  };
  const addTag = (tag) => {
    if (tag.trim() !== "" && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
    setTagInputValue("");
  };
  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Update local state when bookDetails changes
  useEffect(() => {
    setBookName(bookDetails?.booktitle || "");
    setAuthorName(bookDetails?.author || "");
    setdescription(bookDetails?.description || "");
    setBookTagline(bookDetails?.summary || "");
    // setCoverImage(bookDetails?.coverImage || null);
  }, [bookDetails]);

  const handleSubmit = async () => {
    // Start the loader when form submission begins
    loader.start("Creating your book...");
  
    // Basic validation
    if (!bookName.trim() || !authorName.trim() || !description.trim()) {
      alert("Please fill in all the required fields.");
      loader.stop(); // Stop the loader if validation fails
      return;
    }
    setCreateBookstate(true);
    const updatedBookDetails = {
      booktitle: bookName,
      author: authorName,
      chapters: [],
      summary: bookTagline,
      description: description,
      tags: tags,
    };
  
    try {
      const res = await createBook(imageFile, updatedBookDetails, accessToken);
  
      if (res) {
        console.log("Book created successfully:", res);
        setCreateBookstate(false);
        navigate(`/updatebook/${res}`);
        dispatch(setBookDetails(updatedBookDetails));
        dispatch(useractions.updateChapter([]));
        // notify("Book created successfully.");
      } else {
        setCreateBookstate(false);
        console.log("Error occurred while creating the book.");
        notify("Error while creating the book.");
      }
    } catch (error) {
      setCreateBookstate(false);
      console.error("Error in book creation:", error);
      notify("An error occurred while creating the book.");
    } finally {
      setCreateBookstate(false);
    }
  };
  

  // const handleSubmit = async () => {
  //   console.log(description)
  //   // console.log("sdfv")
  //   const updatedBookDetails = {
  //     booktitle: bookName,
  //     author: authorName,
  //     chapters:[],
  //     summary: bookTagline, 
  //     description: "jnjnjn",
  //     tags:tags, 
  //   };
  //   const res = await createBook(imageFile, updatedBookDetails,accessToken)
  //   console.log(updatedBookDetails);
  //   console.log(res);
  //   // Dispatch the action to update book details in the Redux store
  //   if(res){
  //     navigate(`/updatebook/${res}`);
  //     // dispatch(setBookDetails(updatedBookDetails));
  //     // dispatch(useractions.updateChapter([])); 
  //     // setIsIntro((prev) => !prev);
  //   }
  //   else{
  //     // notify("Error while creating book")
  //   }
  //   // console.log(updatedBookDetails);
  // };

  return (
      <>
      {createBookstate ? <Createbookloader Heading="Creating your book..."/> : <div className="container mx-auto mt-10 p-6 rounded-lg shadow-lg max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Create a New Book</h1>
      
      {/* Book Name */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Book Title</label>
        <SunEditor
          setContents={bookName}
          onChange={(content) => setBookName(content)}
          placeholder="Enter Book Title"
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
        <label className="block text-lg mb-2">Book Description</label>
        <SunEditor
          setContents={description}
          onChange={(content) => setdescription(content)}
          placeholder="Enter Book Description"
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
        <label className="block text-lg mb-2">Book Summary</label>
        <SunEditor
          setContents={bookTagline}
          onChange={(content) => setBookTagline(content)}
          placeholder="Enter Book Summary"
          setOptions={{
            height: 50,
            buttonList: [
              ["font", "fontSize", "bold", "italic", "underline"],
              ["align", "list", "undo", "redo"],
            ],
          }}
        />
      </div>
      <div className="mb-6 max-w-[600px]">
        <button
          data-tooltip-target="tooltip-tags"
          type="button"
          for="success"
          className="block mb-1 text-sm font-medium text-black"
        >
          Tags (Tags of the Book)
        </button>
        <div
          id="tooltip-tags"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          eg. Education , Fiction ,Science
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <input
          type="text"
          id="success"
          value={tagInputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="border border-green-500 text-black  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 "
          placeholder="eg. Education , Fiction ,Science"
        />
        <div className="mt-2">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="bg-blue-700 text-white rounded-full p-1 text-xs flex items-center justify-center"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cover Image Upload */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Cover Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2"
        />
        {/* <button onClick={handleUpload}>Upload Image</button> */}
        {/* {coverImage && (
          <div className="mt-4">
            <img
              src={coverImage}
              alt="Cover Preview"
              className="w-48 h-64 object-cover border rounded-md shadow-md"
            />
          </div>
        )} */}
        {previewUrl && <img src={previewUrl} alt="Preview" width="200" height="200" />}
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
    </div>}
      </>
   
  );
};

export default CreateBookPage;
