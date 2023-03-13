import "./App.css";
import CheckoutForm from "./components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

function App() {
  const [price, setPrice] = useState('')
  return (
    <div className="App">
      <h1>Welcome to Stripe Payment</h1>
      <div style={{width: '100%', border: '1px solid green', margin: 'auto', padding: '2%', borderRadius: '10px'}}>

        <input style={{margin: '10px 0', padding: '10px 20px', border: '1px solid green', borderRadius: '20px', background:'#eeeeee'}} type="number" onChange={(e) => setPrice(e.target.value)} placeholder="amount" />
      <Elements stripe={stripePromise}>
        <CheckoutForm price={price} />
      </Elements>
      </div>
    </div>
  );
}

export default App;
