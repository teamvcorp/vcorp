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
      <div className={styles.headerTop}>
        <div className={styles.headerLogoContainer}>
          <Image
            className={styles.headerLogo}
            src="/valogo.png"
            width={175}
            height={200}
            alt="random people"
          />
        </div>
        <ul>
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
          <li>
            <Link href={`${pathname}#careers`}>Careers</Link>
          </li>
          <li>
            <Link href={`${pathname}#resources`}>Resources</Link>
          </li>
        </ul>{" "}
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
