import React, { useEffect, useState } from 'react';
import Navbar from "./NavBar";
import { accept, decline,getbookinfo } from './../API/createbook';
import { notify } from './../store/utils/notify';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const ReviewerInvitationPage = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { Addreviewretoken } = useParams();
  const navigate = useNavigate();
  const [Booktitle,setBooktitle] = useState("");


  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const bookInfo = await getbookinfo(Addreviewretoken);
        setBooktitle(bookInfo); 
        console.log(bookInfo);
        console.log("Reviewer invite page loaded.");
      } catch (error) {
        console.error("Error fetching book information:", error);
      }
    };
  
    fetchBookInfo();
  }, []);

  const handleAccept = async () => {
    if(!accessToken || accessToken === "" || accessToken === undefined){
      notify("Please login to accept the invitation.");
      navigate('/login');
      return;
    }
    const result = await accept(Addreviewretoken, accessToken,"acceptreviewer");
    console.log(result);
    navigate('/');
    if (result) {
      notify("Reviewer invitation accepted");
    } else {
      notify("Failed to accept the Reviewer invite.");
    }
    console.log("Reviewer invite accepted.");
  };

  const handleDecline = async () => {
    if(!accessToken || accessToken === "" || accessToken === undefined){
      notify("Please login to accept the invitation.");
      navigate('/login');
      return;
    }
    console.log("Declining Reviewer invite");
    const result = await decline({ InviteLink: Addreviewretoken }, accessToken,"declinereviewer");
    if (result) {
      notify("Reviewer invitation declined successfully.");
      navigate('/');
    } else {
      notify("Failed to decline the Reviewer invite.");
    }
    console.log("Reviewer invite declined.");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            You're Invited to Review!
          </h1>
          <p className="text-gray-600 text-center mb-6">
            You have been invited to review the book{" "}
            <span className="font-semibold text-gray-800">{Booktitle}</span>.
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
              onClick={handleDecline}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewerInvitationPage;
