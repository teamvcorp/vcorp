"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import styles from "./components.module.css";
import { matrix } from "../data/matrix.js";
import "./donate.css";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_live_51NVkTHFOfT7vP5JsCPOhG7Fd8scivouuEK4EstljVXjIy3pop9JZ90R4SWtFTc4CiSc05xAdXtCCm4B0hCaoKNpL007npgFlor"
);

const DonateForm = ({ amount }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads  
    fetch("/api/paymentIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <div className={styles.donationForm}>
        <div>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm amount={amount} />
            </Elements>
          )}
        </div>
      </div>
    </>
  );
};

export default DonateForm;
