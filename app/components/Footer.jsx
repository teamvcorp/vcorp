import React from "react";
import styles from './components.module.css'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelopeOpenText,FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className={styles.footerLeft}>
        <div className={styles.footerIcons}>
          <p>Find Follow and Connect.</p>
          <div className={styles.iconContainer}>
            <span className='socialMediaIcon'><FaFacebookF/></span>
            <span className='socialMediaIcon'><FaTwitter/></span>
            <span className='socialMediaIcon'><FaInstagram/></span>
            <span className='socialMediaIcon'><FaLinkedinIn/></span>
            <span className='socialMediaIcon'><FaEnvelopeOpenText/></span>
            <span className='socialMediaIcon'><FaPhoneAlt/></span>
          </div>
        </div>
        <div className={styles.subscribe}>
          <p>Subscribe to our Newletter</p>
          <div className="inputBox">
            <input type="text" placeholder=" Enter Email Address" />
            <button>Submit</button>
          </div>
        </div>
      </div>
      <div className={styles.footerRight}>
        <h3>Mission Statement</h3>
        <p>
        Enabling social contagion through the power of education, compassion, and innovation.
        </p>
        <div className={styles.disclaimer}>
        <p>Privacy Policy</p> <p> Terms of Service</p> <p> Financial Records</p> 
        </div>
        <p className='copyrightP'> &copy; 2023 The Vonder Becke Academy Corp</p> 
      </div>
    </>
  );
};

export default Footer;  

