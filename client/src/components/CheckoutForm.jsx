import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    console.log("handleSubmit called");
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or elements not available");
      return;
    }

    setIsProcessing(true);
    console.log("Processing payment...");

    // Create payment intent on the server (you need to set up an API endpoint for this)
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // Example amount in cents
    });

    console.log("Payment intent created");

    const { clientSecret } = await response.json();
    console.log("Client secret received");

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Customer Name",
          },
        },
      }
    );

    console.log("Payment confirmed");

    if (error) {
      console.error("Payment error:", error);
      setError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("Payment successful");
      setSuccessMessage("Payment successful! Thank you for your purchase.");
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded-lg shadow-md"
    >
      <CardElement className="p-4 border rounded mb-4" />
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
