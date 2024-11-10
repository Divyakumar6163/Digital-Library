import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as userinfoactions from "../store/actions/userinfoactions.jsx";
import Footer from "./Footer";
import Navbar from "./NavBar";
import { store } from "./../store/store";
import * as useractions from "./../store/actions/userinfoactions";
import * as authactions from "./../store/actions/authactions";
import * as bookactions from "./../store/actions/bookactions";
import { useNavigate } from "react-router";
const UserProfile = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const profile = useSelector((state) => state.user.userinfo.profileImage);

  // Profile fields from state
  const [name, setName] = useState(userState.userinfo.name || "");
  const [mobile, setMobile] = useState(userState.userinfo.phoneno || "");
  const [email] = useState(userState.userinfo.emailid); // Email is not editable
  const [about, setAbout] = useState(userState.userinfo.about || "");
  const [categories, setCategories] = useState(
    userState.userinfo.favoriteCategories || []
  );
  const [profileImage, setProfileImage] = useState(profile || null);

  // Editable mode toggle
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Load initial values for the profile on component mount
    setName(userState.userinfo.name || "");
    setMobile(userState.userinfo.phoneno || "");
    setAbout(userState.userinfo.about || "");
    setCategories(userState.userinfo.favoriteCategories || []);
    setProfileImage(userState.userinfo.profileImage || null);
  }, [userState.userinfo]);

  // Save handler
  const handleSave = () => {
    // Dispatch update to the Redux store
    dispatch(
      userinfoactions.updateUserProfile({
        name,
        phoneno: mobile,
        about,
        favoriteCategories: categories,
        profileImage,
      })
    );
    setIsEditing(false);
  };

  // Add new category
  const addCategory = () => {
    setCategories([...categories, ""]);
  };

  // Update specific category
  const updateCategory = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

  // Remove category
  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSignOut = () => {
    store.dispatch(useractions.setlogin(false));
    store.dispatch(useractions.setuserinfo({}));
    store.dispatch(authactions.setAccessToken(null));
    store.dispatch(authactions.setRefreshToken(null));
    store.dispatch(bookactions.setBookDetails(null));
    navigate("/");
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            >
              {isEditing ? "Update" : "Edit"}
            </button>
          </div>

          {/* Profile Image */}
          <div className="flex items-center space-x-4 mt-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-500">
              {profileImage && typeof profileImage === "string" ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 flex items-center justify-center h-full">
                  No Image
                </span>
              )}
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Upload Profile Image"
                />
              )}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-gray-600 font-semibold">Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none"
                />
              ) : (
                <p className="text-gray-800">{name}</p>
              )}
            </div>
            {/* Mobile Number */}
            <div>
              <label className="text-gray-600 font-semibold">Mobile:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none"
                />
              ) : (
                <p className="text-gray-800">{mobile}</p>
              )}
            </div>

            {/* Email (Non-Editable) */}
            <div>
              <label className="text-gray-600 font-semibold">Email:</label>
              <p className="text-gray-800">{email}</p>
            </div>

            {/* About Section */}
            <div>
              <label className="text-gray-600 font-semibold">About Me:</label>
              {isEditing ? (
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none"
                  rows="4"
                />
              ) : (
                <p className="text-gray-800">{about}</p>
              )}
            </div>

            {/* Favorite Book Categories */}
            <div>
              <label className="text-gray-600 font-semibold">
                Favorite Book Categories:
              </label>
              {isEditing ? (
                <div className="flex flex-col space-y-2 mt-1">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => updateCategory(index, e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md outline-none"
                      />
                      <button
                        onClick={() => removeCategory(index)}
                        className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addCategory}
                    className="mt-2 px-4 py-2 text-blue-500 bg-blue-100 rounded-md hover:bg-blue-200 transition"
                  >
                    + Add Category
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="w-full max-w-2xl mt-8 text-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
