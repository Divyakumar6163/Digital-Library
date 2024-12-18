import React from 'react';
import Navbar from "./NavBar";
import {acceptcollab} from './../API/createbook'
import { notify } from './../store/utils/notify';
import {useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
const InvitationPage = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { Addcollabtoken } = useParams();
  const navigate = useNavigate();
  const handleAccept = async () => {
    const result = await acceptcollab(Addcollabtoken, accessToken);
    console.log(result);
    navigate('/createBook')
    if (result) {
      notify("Invitation accepted");
    } else {
      notify("Failed to accept the invite.");
    }
    console.log("Invite accepted.");
  };
  
  const handleDecline = () => {

    console.log("Invite declined.");
  };

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          You're Invited!
        </h1>
        <p className="text-gray-600 text-center mb-6">
          You have been invited to collaborate on the book{" "}
          <span className="font-semibold text-gray-800">"Book Title"</span>.
        </p>

        <div className="flex space-x-4 justify-center">
          <button
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default InvitationPage;
