"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import Navigation from "./components/nav";
import Footer from "./components/Footer";
import { BiBuildingHouse } from "react-icons/bi";
import { FaNotesMedical } from "react-icons/fa";
import { MdOutlineNightShelter, MdFastfood } from "react-icons/md";
import { HiLightBulb } from "react-icons/hi";
import {
  FaRegCalendarCheck,
  FaPiggyBank,
  FaBookReader,
} from "react-icons/fa";
import {BsFillArrowUpSquareFill } from "react-icons/bs";


export default function Home() {
  const pathname = usePathname();
  const [readMoreState, setUseMoreState] = useState({
    paragraphOne: false,
    paragraphTwo: false,
  });
 

  return (
    <main className={styles.main}>
      <section className={styles.header} id="pagetop">
        <Navigation />
      </section>
    
   
     
      <section className={styles.footer}>
        <Footer />
      </section>
    </main>
  );
}
