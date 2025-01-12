
import React, { useEffect } from "react";
import Navbar from "./../components/NavBar";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import PremiumPage from "../components/PremiumPage";
import PremiumUserpage from "../components/Premiumuser";
const Premiumpage = () => {
    //   const navigate = useNavigate();
    const isPremium = useSelector((state) => state.user.userinfo.ispreminum);
    return (
        <>
        <Navbar />
        {isPremium ?<PremiumUserpage/> : <PremiumPage/>}
        <Footer />
        </>
    );
};


export default Premiumpage;
