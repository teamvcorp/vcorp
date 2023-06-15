
import React from "react";
import Image from 'next/image'
import Link from "next/link";
import styles from "./components.module.css";

const Navigation = () => {

  return (
    <>
      <div className={styles.headerTop}>
        <div className={styles.headerLogoContainer}>
          <Image
            className={styles.headerLogo}
            src='/valogo.png'
            width={175}
            height={200}
            alt="random people"
          />
        </div>
        <ul>
          <li></li>
          <li>
            <Link href="/">About</Link>
          </li>
          <li>
            <Link href="/">Projects</Link>
          </li>
          <li>
            <Link href="/">Volunteer</Link>
          </li>
          <li>
            <Link href="/">Donate</Link>
          </li>
          <li>
            <Link href="/">Careers</Link>
          </li>
          <li>
            <Link href="/">Resources</Link>
          </li>
        </ul>{" "}
      </div>

      <div className={styles.headerBottom}>
  
          <div className={styles.headerBottomContent}>
        <h2 className="whtTxt">Projects Designed to</h2>
        <h1 className="ltBlueTxt">Better Society Through the Individual.</h1>
        <Link href="/donate">
          <button className="redBtn" >Donate</button>
        </Link>
      
        </div>
      </div>
      
    </>
  );
};


export default Navigation;
