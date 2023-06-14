import React from "react";
import styles from './components.module.css'

const Footer = () => {
  return (
    <>
      <div className="leftSide">
        <div className={styles.footerIcons}>
          <p>Find Follow and Connect.</p>
          <div className={styles.iconContainer}>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
          </div>
        </div>
        <div className="subscribeContainer">
          <p>Subscribe to our Newletter</p>
          <div className="inputBox">
            <input type="text" placeholder="Enter Email Address" />
            <button>Submit</button>
          </div>
        </div>
      </div>
      <div className="rightSide">
        <h3>MIssion Statement</h3>
        <p>
          Enabling transformative change through the power of education,
          compassion, and innovative problem-solving.
        </p>
      </div>
    </>
  );
};

export default Footer;
