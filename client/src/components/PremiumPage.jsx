import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router";
const PremiumPage = () => {
  const navigate = useNavigate();
  const handlePlan = () => {
    navigate("/payment");
  };
  return (
    <>
      <Navbar />
      <div className="p-6 font-sans">
        {/* Hero Section */}
        <section className="text-center mb-10 bg-gray-100 p-10 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">
            Unlock Exclusive Premium Content
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Choose a subscription plan that works for you and enjoy unlimited
            access to premium eBooks and more.
          </p>
          {/* <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
            Get Started
          </button> */}
        </section>

        {/* Subscription Offers Section */}
        <section className="text-center mb-10">
          <h2 className="text-2xl font-semibold mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Array of subscription plans */}
            {subscriptionPlans.map((plan, index) => (
              <div
                className="bg-white rounded-lg p-6 shadow-md transform transition hover:scale-105"
                key={index}
              >
                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <p className="text-gray-500 mb-4">{plan.description}</p>
                <p className="text-2xl font-semibold mb-4">${plan.price}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                  onClick={handlePlan}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
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

// Mock data for subscription plans
const subscriptionPlans = [
  {
    title: "1 Month Plan",
    description: "Enjoy unlimited access for one month.",
    price: "9.99",
  },
  {
    title: "6 Months Plan",
    description: "Save more with a 6-month subscription.",
    price: "49.99",
  },
  {
    title: "1 Year Plan",
    description: "Best value for unlimited access all year.",
    price: "89.99",
  },
];

export default PremiumPage;
