import { connectDb } from "./db/db.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import app from "./app.js";
dotenv.config();
export const stripe = new Stripe(String(process.env.STRIPE_KEY));

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(`Database connection error: ${error}`));
