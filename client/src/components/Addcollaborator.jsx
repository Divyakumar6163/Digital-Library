import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import { accept, decline, getbookinfo } from "./../API/createbook";
import { notify } from "./../store/utils/notify";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
const CollabinvitationPage = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { Addcollabtoken } = useParams();
  const navigate = useNavigate();
  const [Booktitle, setBooktitle] = useState("");

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const bookInfo = await getbookinfo(Addcollabtoken);
        setBooktitle(bookInfo);
        console.log(bookInfo);
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
    console.log(accessToken);
    const result = await accept(Addcollabtoken, accessToken, "acceptcollab");
    console.log(result);
    navigate("/createBook");
    if (result) {
      notify("Invitation accepted");
    } else {
      notify("Failed to accept the invite.");
    }
    console.log("Invite accepted.");
  };

  const handleDecline = async () => {
    if(!accessToken || accessToken === "" || accessToken === undefined){
      notify("Please login to accept the invitation.");
      navigate('/login');
      return;
    }
    console.log("Declining invite");
    const result = await decline(
      { InviteLink: Addcollabtoken },
      accessToken,
      "declinecollab"
    );
    if (result) {
      notify("Invitation declined successfully.");
      navigate("/");
    } else {
      notify("Failed to decline the invite.");
    }
    console.log("Invite declined.");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            You're Invited!
          </h1>
          <p className="text-gray-600 text-center mb-6">
            You have been invited to collaborate on the book{" "}
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


export default CollabinvitationPage;