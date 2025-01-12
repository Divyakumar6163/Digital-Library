import React, { useEffect } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToLink } from "./../App";
const PremiumPage = () => {
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.userinfo.name);
  const emailid = useSelector((state) => state.user.userinfo.emailid);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const onPayment = async (plan) => {
    try {

      const { data } = await axios.post(`${ToLink}/api/create-order`, {
        premiumtype: plan.type,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

      if (!data.success) {
        throw new Error("Failed to create order");
      }

      const { amount, id: order_id, currency } = data.order;

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Premium Subscription",
        description: plan.title,
        order_id,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          const verifyResponse = await axios.post(`${ToLink}/api/verify-payment`, {
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            signature: razorpay_signature,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

          if (verifyResponse.data.success) {
            alert("Payment Successful!");
            navigate("/");
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: username,
          email: emailid,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Error occurred while initiating payment. Please try again.");
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        console.error(`Error loading script ${src}`);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const handlePlan = (plan) => {
    onPayment(plan);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 font-sans">

        <section className="text-center mb-10 bg-gray-100 p-10 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">
            Unlock Exclusive Premium Content
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Choose a subscription plan that works for you and enjoy unlimited
            access to premium eBooks and more.
          </p>
        </section>


        <section className="text-center mb-10">
          <h2 className="text-2xl font-semibold mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <div
                className="bg-white rounded-lg p-6 shadow-md transform transition hover:scale-105"
                key={index}
              >
                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <p className="text-gray-500 mb-4">{plan.description}</p>
                <p className="text-2xl font-semibold mb-4">₹{plan.price}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                  onClick={() => handlePlan(plan)}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </section>


        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Why Go Premium?</h2>
          <ul className="space-y-4 text-gray-600">
            <li>📖 Access to premium-only content</li>
            <li>📚 Early access to new releases</li>
            <li>💸 Special discounts on purchases</li>
            <li>🚫 Ad-free reading experience</li>
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
};


const subscriptionPlans = [
  {
    type: "3-month",
    title: "3 Month Plan",
    description: "Enjoy unlimited access for 3-month subscription.",
    price: "3",
  },
  {
    type: "6-month",
    title: "6 Months Plan",
    description: "Save more with a 6-month subscription.",
    price: "6",
  },
  {
    type: "12-month",
    title: "1 Year Plan",
    description: "Best value for unlimited access all year.",
    price: "12",
  },
];

export default PremiumPage;
