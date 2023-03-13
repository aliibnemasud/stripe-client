import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";

const CheckoutForm = ({price}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [cardError, setCardError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {

    fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'            
          },
        body: JSON.stringify({price})
    })
    .then(res => res.json())
    .then(data => {
        setClientSecret(data.clientSecret)
    })

  },[price]) 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }

    // confirming the payment

    const {paymentIntent, error: intentError} = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: card,
            billing_details: {
              name: 'Ali Ibne Masud',
            },
          },
        },
      );

      if(intentError) {
        setCardError(intentError?.message)
        setSuccess('')        
      } else {
        setSuccess('Payment Succeed!')
        alert('Payment Done!')
        console.log(paymentIntent)
      }

  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            border: "1px solid black",
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <button type="submit" style={{ marginTop: "20px", background: "green", padding: "10px 20px", color: "white", border: "none" }} disabled={!stripe}>
        Pay
      </button>
      {
        success && <p style={{color: 'green'}}>{success}</p>
      }
      {
        cardError && <p style={{color: 'red'}}>{cardError}</p>
      }
    </form>
  );
};

export default CheckoutForm;
