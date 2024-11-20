import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useParams, useNavigate } from "react-router-dom";
import { ToLink } from "../App";
import axios from "axios";
import { notify } from "../store/utils/notify";
import Spinner from "../store/utils/spinner";

function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          `${ToLink}/verifyemail`,
          { token },
          { withCredentials: true }
        );
        console.log(response.data);
        // notify("Email verified. Please login!");
        setIsVerified(true);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Email verification failed:", error);
        // setIsVerified(false);
        // notify("Verification failed or link expired. Please try again.");
      } finally {
         // Ensure loading is stopped regardless of success or failure
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <>
      <NavBar />
      <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {loading ? (
          <Spinner /> // Use your Spinner component or a loading message
        ) : isVerified ? (
          <div>
            <h2>Email verified. Please login!</h2>
          </div>
        ) : (
          <div>
            <h2>Verification Failed</h2>
            <p>The link is expired or invalid. Please try again.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default VerifyEmail;
