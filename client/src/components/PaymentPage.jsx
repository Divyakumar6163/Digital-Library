import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51NglaiSFeDJDpCBiVBHMfOrGGqsJeVMeXORyqaayB0biGjky3cWjrAM0hFkgRM9esbShhUz01hQlUrQks8Pd7lDy007yhm35Z2"
);

const PaymentPage = () => {
  return (
    <div className="p-6 font-sans text-center">
      <h1 className="text-3xl font-bold mb-6">Complete Your Payment</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default PaymentPage;
