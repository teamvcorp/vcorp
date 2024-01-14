"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./components.module.css";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  return (  
    <>  
    <div className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.headerLogoContainer}>
          <Image
            className={styles.headerLogo}
            src="/valogo1.png"
            width={175}
            height={200} 
            alt="random people"
          />
        </div>
        <ul className={styles.navLinks}>
          <li></li>
          <li>
            <Link href={`${pathname}#about`}>About</Link>
          </li>
          <li>
            <Link href={`${pathname}#projects`}>Projects</Link>
          </li>
          <li>
            <Link href={`${pathname}#volunteer`}>Volunteer</Link>
          </li>
          <li>
            <Link href={`${pathname}#donate`}>Donate</Link>
          </li>
          
        </ul>{" "}
      </div>
      </div>


      <div className={styles.headerBottom}>
        <div className={styles.headerBottomContent}>
          <h2 className="whtTxt">Projects Designed to</h2>
          <h1 className="ltBlueTxt">Better Society Through Education.</h1>
          <Link href="/donate">
            <button className="redBtn">Donate</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
