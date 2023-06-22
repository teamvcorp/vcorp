"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import styles from "./components.module.css";
import  {matrix}  from "../data/matrix.js";
import Accordion from "../components/Accordion";

const DonateForm = () => {
  const [data, setdata] = useState([...matrix.donationLevels]);
  const [formData, setformData] = useState({
    amount: "",
    frequency: "",
    fullName: "",
  });
 
  return (
    <>
      <div className={styles.donationForm}>
        <h3>Donation Form</h3>
        <div>
          

          <form className={styles.donationFormLeft}>
            <fieldset>
              <label for="amount"> Amount</label>
              <input
                className="inputS inputAll"
                id="amount"
                name="amount"
                type="text"
              />
              <label className='space' for="frequency">Frequency</label>
              <select
                className="inputS inputAll dropDown"
                name="frequency"
                id="frequency"
              >
                <option value="oneTime">One Time</option>
                <option value="monthlyTime">Monthly</option>
              </select>
            </fieldset>
            <fieldset>
              <label for="name">Full Name</label>
              <input
                className="inputM inputAll"
                id="name"
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <input
                className="inputM inputAll"
                id="name"
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
              </fieldset>
              <fieldset>
              <label for="address">Address</label>
              <input
                className="inputXL inputAll"
                type="text"
                name="address"
                id="address"
                placeholder="Street Address"
              />
              <input
                className="inputXS inputAll"
                name="apt"
                id="apt"
                type="text"
                placeholder="Apt./Ste."
              />
              </fieldset>
              <fieldset>
              <label for="City"></label>
              <input
                className="inputM inputAll"
                type="text"
                name="city"
                placeholder="City"
              />
              <input
                className="inputXS inputAll"
                type="text"
                name="state"
                placeholder="State"
              />
              <input
                className="inputS inputAll"
                type="text"
                name="zipCode"
                placeholder="Zip Code"
              />
            </fieldset>
            <fieldset>
              <label for="phone">Contact Info</label>
              <input
                className="inputM inputAll"
                type="text"
                id="phone"
                name="phone"
                placeholder="phone"
              />
              {/* <label for="email">Email</label> */}
              <input
                className="inputM inputAll"
                type="text"
                id="email"
                name="email"
                placeholder="email"
              />
            </fieldset>
            <label className='fullLabel' for="motivatedBy">What motivated you to donate today?</label>
            <input
              className="inputS inputAll"
              type="text"
              name="motivatedBy"
              id="motivatedBy"
            />
            <fieldset>
                <p>May we recognize your gift publicly?</p>
              <div className={styles.checkboxContainer}>
                <input
                  className="inputAll checkBox"
                  type="checkbox"
                  name="gift"
                  id="gift"
                />
                <label for="gift">Yes</label>
                <input
                  className="inputAll checkBox"
                  type="checkbox"
                  name="gift"
                  id="giftNo"
                />
                <label for="giftNo">No</label>
              </div>
              </fieldset>
            <fieldset>
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
                  Please let us know why you believe in the Von Der Becke
                  Academy Corp
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
              <Link
                target="_blank"
                href="https://pay.thevacorp.com/GeneralDonation"
              >
                Donate via Godaddy!
              </Link>
              <Link
                target="_blank"
                href="https://donate.stripe.com/test_bIY8yV4kL0iofPabII"
              >
                Donate via Stripe!
              </Link>
              {/* credit card form? */}
            </fieldset>
          </form>
         
          <div className={styles.donationFormRight}>
            <p> See how your donation helps improve your community</p>
            <div className={styles.formChart}>
              {data &&
                data.map((info, idx) => {
                  return (
                    <Accordion key={idx} title={info.amount} des={info.description} />
                  );
                })}
            </div>
            <button type="submit">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonateForm;
