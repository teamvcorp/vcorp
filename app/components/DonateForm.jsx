"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import styles from "./components.module.css";

const DonateForm = () => {
  const [formData, setformData] = useState({
    amount: "",
    frequency: "",
    fullName: "",
  });
  return (
    <>
      <div className={styles.donationFormContainer}>
        <form>
          <fieldset>
            <label for="amount">Donation Amount</label>
            <input id="amount" name="amount" type="text" />
            <label for="frequency">Donation Frequency</label>
            <select name="frequency" id="frequency">
              <option value="oneTime">One Time</option>
              <option value="monthlyTime">Monthly</option>
            </select>
          </fieldset>
          <fieldset>
            <label for="name">Name</label>
            <input
              id="name"
              name="fullName"
              type="text"
              placeholder="Enter full name"
            />
            <label for="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              placeholder="House number and Street Name"
            />
            <input name="apt" id="apt" type="text" />
            <input type="text" name="city" placeholder="City" />
            <input type="text" name="state" placeholder="State" />
            <input type="text" name="zipCode" placeholder="Zip Code" />
          </fieldset>
          <fieldset>
            <label for="phone">Phone</label>
            <input type="text" id="phone" name="phone" placeholder="phone" />
            <label for="email">Email</label>
            <input type="text" id="email" name="email" placeholder="email" />
          </fieldset>
          <label for="motivatedBy">What motivated you to donate today?</label>
          <input type="text" name="motivatedBy" id="motivatedBy" />
          <fieldset>
            <div>
              <p>May we recognize your gift publicly</p>
              <input type="checkbox" name="gift" id="gift" />
              <label for="gift">Yes</label>
              <input type="checkbox" name="gift" id="giftNo" />
              <label for="giftNo">No</label>
            </div>
            <div>
              <p>Special Desingation (optional)</p>
              <textarea
                name="designation"
                id="designation"
                cols="50"
                rows="4"
              ></textarea>
            </div>
            <div>
              <p>
                Please let us know why you believe in the Von Der Becke Academy
                Corp
              </p>
              <textarea
                name="believe"
                id="believe"
                cols="50"
                rows="4"
              ></textarea>
            </div>
          </fieldset>
          <fieldset>
            <Link target='_blank' href='https://pay.thevacorp.com/GeneralDonation'>
              Donate via Godaddy!
            </Link>
            <Link target='_blank' href='https://donate.stripe.com/test_bIY8yV4kL0iofPabII'>
              Donate via Stripe!
            </Link>
            {/* credit card form? */}
          </fieldset>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default DonateForm;
