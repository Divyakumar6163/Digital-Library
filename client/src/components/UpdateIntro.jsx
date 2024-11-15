import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cropper from "react-easy-crop";
import getCroppedImg from "./util/getCroppedImg";
import { updateIntro } from "../API/createbook";
import { notify } from "./../store/utils/notify";
import { useNavigate } from "react-router";
const UpdateBookIntro = ({ bookIntroDetails, setShowIntro }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);

  console.log(bookIntroDetails);
  const [bookName, setBookName] = useState(bookIntroDetails?.booktitle || "");
  const [summary, setSummary] = useState(bookIntroDetails?.summary || "");
  const [briefSummary, setBriefSummary] = useState(
    bookIntroDetails?.briefSummary || ""
  );
  const [objectives, setObjectives] = useState(
    bookIntroDetails?.objective || ""
  );

  const [version, setVersion] = useState(bookIntroDetails?.version || "");
  const [videoLink, setVideoLink] = useState(bookIntroDetails?.videoLink || "");
  const [details, setDetails] = useState(bookIntroDetails?.details || "");
  const [targetAudience, setTargetAudience] = useState(
    bookIntroDetails?.targetAudience || "BEGINNER"
  );
  const [license, setLicense] = useState(
    bookIntroDetails?.license || "ALL RIGHTS RESERVED"
  );
  const [attributionTitle, setAttributionTitle] = useState(
    bookIntroDetails?.attributionTitle || ""
  );
  const [attributionAuthor, setAttributionAuthor] = useState(
    bookIntroDetails?.attributionAuthor || ""
  );
  const [skills, setSkills] = useState(bookIntroDetails?.skills || []);
  const [tags, setTags] = useState(bookIntroDetails?.tags || []); //
  const [collaborators, setCollaborators] = useState(
    bookIntroDetails.collaborators || []
  );
  const [coAuthors, setCoAuthors] = useState(bookIntroDetails.coAuthors || []);
  const [reviewers, setReviewers] = useState(bookIntroDetails.reviewers || []);
  const [skillInputValue, setSkillInputValue] = useState("");
  const [tagInputValue, setTagInputValue] = useState("");
  const [collaboratorInputValue, setCollaboratorInputValue] = useState("");
  const [coAuthorInputValue, setCoAuthorInputValue] = useState("");
  const [reviewerInputValue, setReviewerInputValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImagePrev, setCroppedImagePrev] = useState(
    bookIntroDetails?.image
  );
  const [croppedImage, setCroppedImage] = useState(bookIntroDetails?.image);

  const handleFileChange = (e) => {
    setIsCropping(true);
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = useCallback(async () => {
    try {
      const croppedImg = await getCroppedImg(
        previewUrl,
        croppedAreaPixels,
        1024,
        512
      );
      setCroppedImagePrev(URL.createObjectURL(croppedImg));
      setCroppedImage(croppedImg);
      setIsCropping(false);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  }, [previewUrl, croppedAreaPixels]);

  const clearImageSelection = () => {
    setIsCropping(false);
    setImageFile(null);
    setPreviewUrl(null);
    setCroppedImagePrev(null);
    setCroppedImage(null);
  };

  const handleSubmit = async () => {
    if (!bookName.trim() || !summary.trim()) {
      notify("Please fill in all the required fields.");
      return;
    }

    const updatedIntroDetails = {
      booktitle: bookName,
      summary,
      briefSummary,
      objective: objectives,
      details,
      version,
      videoLink,
      targetAudience,
      license,
      attributionTitle,
      attributionAuthor,
      image: croppedImage,
      tags,
      skills,
      collaborators,
      coAuthors,
      reviewers,
    };
    setShowIntro(false);
    try {
      const response = await updateIntro(
        bookIntroDetails._id,
        updatedIntroDetails,
        accessToken
      );
      if (response) {
        notify("Book Intro Updated!");
        // dispatch({ type: "UPDATE_BOOK_INTRO", payload: updatedIntroDetails });
      } else {
        notify("Error while updating the intro.");
      }
    } catch (error) {
      console.error("Error updating book intro:", error);
      notify("An error occurred while updating the intro.");
    }
  };
  const handleKeyDown = (e, addItem, inputValue, setInputValue) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addItem(inputValue.trim());
      setInputValue("");
    }
  };

  const addSkill = (skill) => {
    if (!skills.includes(skill)) setSkills([...skills, skill]);
  };

  const addTag = (tag) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
  };

  const addCollaborator = (email) => {
    if (email && !collaborators.includes(email))
      setCollaborators([...collaborators, email]);
  };

  const addCoAuthor = (email) => {
    if (email && !coAuthors.includes(email))
      setCoAuthors([...coAuthors, email]);
  };

  const addReviewer = (email) => {
    if (email && !reviewers.includes(email))
      setReviewers([...reviewers, email]);
  };
  const removeItem = (item, setItems) => {
    setItems((items) => items.filter((i) => i !== item));
  };

  return (
    <div className="container mx-auto mt-10 p-6 rounded-lg shadow-lg max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Update Book Intro</h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-lg mb-2">*Book Title</label>
        <input
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Book Title"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={skillInputValue}
          onChange={(e) => setSkillInputValue(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(e, addSkill, skillInputValue, setSkillInputValue)
          }
          className="border p-2 w-full"
          placeholder="Type skills and press 'Enter'"
        />
        <div className="flex flex-wrap mt-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
            >
              {skill}
              <button
                onClick={() => removeItem(skill, setSkills)}
                className="ml-2 text-xs bg-blue-700 rounded-full p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Input */}
      <div className="mb-4">
        <input
          type="text"
          value={tagInputValue}
          onChange={(e) => setTagInputValue(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(e, addTag, tagInputValue, setTagInputValue)
          }
          className="border p-2 w-full"
          placeholder="Type tags and press 'Enter'"
        />
        <div className="flex flex-wrap mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
            >
              {tag}
              <button
                onClick={() => removeItem(tag, setTags)}
                className="ml-2 text-xs bg-blue-700 rounded-full p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborators Input */}
      <div className="mb-4">
        <input
          type="email"
          value={collaboratorInputValue}
          onChange={(e) => setCollaboratorInputValue(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              addCollaborator,
              collaboratorInputValue,
              setCollaboratorInputValue
            )
          }
          className="border p-2 w-full"
          placeholder="Enter collaborator email and press 'Enter'"
        />
        <div className="flex flex-wrap mt-2">
          {collaborators.map((collab, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
            >
              {collab}
              <button
                onClick={() => removeItem(collab, setCollaborators)}
                className="ml-2 text-xs bg-blue-700 rounded-full p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Co-Authors Input */}
      <div className="mb-4">
        <input
          type="email"
          value={coAuthorInputValue}
          onChange={(e) => setCoAuthorInputValue(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              addCoAuthor,
              coAuthorInputValue,
              setCoAuthorInputValue
            )
          }
          className="border p-2 w-full"
          placeholder="Enter co-author email and press 'Enter'"
        />
        <div className="flex flex-wrap mt-2">
          {coAuthors.map((coAuthor, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
            >
              {coAuthor}
              <button
                onClick={() => removeItem(coAuthor, setCoAuthors)}
                className="ml-2 text-xs bg-blue-700 rounded-full p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reviewers Input */}
      <div className="mb-4">
        <input
          type="email"
          value={reviewerInputValue}
          onChange={(e) => setReviewerInputValue(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              addReviewer,
              reviewerInputValue,
              setReviewerInputValue
            )
          }
          className="border p-2 w-full"
          placeholder="Enter reviewer email and press 'Enter'"
        />
        <div className="flex flex-wrap mt-2">
          {reviewers.map((reviewer, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
            >
              {reviewer}
              <button
                onClick={() => removeItem(reviewer, setReviewers)}
                className="ml-2 text-xs bg-blue-700 rounded-full p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <label className="block text-lg mb-2">*Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Summary"
        />
      </div>

      {/* Brief Summary */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Brief Summary</label>
        <textarea
          value={briefSummary}
          onChange={(e) => setBriefSummary(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Brief Summary"
        />
      </div>

      {/* Objectives */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Objectives</label>
        <textarea
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Objectives"
        />
      </div>

      {/* Details */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Details"
        />
      </div>
      {/* Version */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Version</label>
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Version"
        />
      </div>

      {/* Video Link */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Video Link</label>
        <input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Video Link"
        />
      </div>

      {/* Target Audience */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Target Audience</label>
        <select
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      {/* License */}
      <div className="mb-4">
        <label className="block text-lg mb-2">License</label>
        <select
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="ALL RIGHTS RESERVED">All Rights Reserved</option>
          <option value="CREATIVE COMMONS">Creative Commons</option>
          <option value="PUBLIC DOMAIN">Public Domain</option>
        </select>
      </div>

      {/* Attribution Author */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Attribution Author</label>
        <input
          type="text"
          value={attributionAuthor}
          onChange={(e) => setAttributionAuthor(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Attribution Author"
        />
      </div>

      {/* Attribution Title */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Attribution Title</label>
        <input
          type="text"
          value={attributionTitle}
          onChange={(e) => setAttributionTitle(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter Attribution Title"
        />
      </div>

      {/* Cover Image */}
      <div className="mb-4">
        <label className="block text-lg mb-2">Cover Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2"
        />
        {previewUrl && (
          <div className="relative">
            <button
              onClick={clearImageSelection}
              className="absolute z-20 -top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              aria-label="Remove selected image"
            >
              ✕
            </button>
            <div
              className="crop-container"
              style={{
                position: "relative",
                height: "300px",
                width: "100%",
              }}
            >
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={2 / 1}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          </div>
        )}
        {isCropping && (
          <button
            onClick={handleCropImage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow mt-2"
          >
            Crop Image
          </button>
        )}
      </div>
      {/* Preview Cropped Image */}
      {croppedImagePrev && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Cropped Image Preview:</h3>
          {/* {imageFile !== null && (
            <img
              src={URL.createObjectURL(croppedImage)}
              alt="Cropped"
              width="200"
            />
          )} */}
          {<img src={croppedImagePrev} alt="Cropped" width="200" />}
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Update Intro
        </button>
      </div>
    </div>
  );
};

export default UpdateBookIntro;
