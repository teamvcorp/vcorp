import { useState } from "react";
import styles from "./accordian.module.css";

import React from "react";

const Accordion = ({ title, des }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div
        className={`${styles.accordianBox} ${styles.box}`}
        onClick={() => setIsActive(!isActive)}
      >
        {title}
      </div>

      {isActive && <p className={styles.accordianP}>{des}</p>}
    </>
  );
};

export default Accordion;
