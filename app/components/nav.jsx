import React from "react";
import Link from "next/link";
import styles from './components.module.css'

const Navigation = () => {
  return (
    <>
    <div className={styles.headerTop}>
        <image src='/logo.png' width={25}height={25} />
      <ul>
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
        <h2>Projects Designed to...</h2>
        <h1>Better society through the individual</h1>
        <Link href='/'>
            <button>Donate</button>
        </Link>
    </div>
    <p className="rightSide">Improve your community. Donate today!</p>
    </>
  );
};

export default Navigation;
