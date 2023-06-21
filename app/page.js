"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import Navigation from "./components/nav";
import Card from "./components/Card";
import Footer from "./components/Footer";
import { BiBuildingHouse } from "react-icons/bi";
import { BsBriefcaseFill } from "react-icons/bs";
import { GrHome } from "react-icons/gr";
import { HiLightBulb } from "react-icons/hi";
import {
  FaRegHandshake,
  FaHandHoldingUsd,
  FaGraduationCap,
  FaRegCalendarCheck,
  FaPiggyBank,
  FaBookReader,
} from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";



export default function Home() {
  const pathname = usePathname();

  
  return (
    <main className={styles.main}>
      <section className={styles.header} id="pagetop">
        <Navigation />
      </section>
      <section className={styles.about} id="about">
        <div className={styles.aboutContainer}>
          <h1 className="blueTxt">About</h1>
          <h2>The Von Der Becke Academy Corp </h2>
          <h3 className="navyTxt">Mission Statement</h3>
          <p className="italicP">
            Enabling transformative change through the power of education,
            compassion, and innovative problem-solving.
          </p>
          <p>
            Image a world where you could just live, were things you need to
            survive are just there for you and opportunity is always knocking. I
            bet you can recall a day that you have said something like, "Man if
            I only knew, things would be different!". We aim to help you achieve
            that our programs look to solve problems like housing, health and
            fitness, food sustainability, educational disparities, and social
            inclusion. The Von Der Becke academy feels strongly that each
            individual has somthing postive to contribute to our society and if
            we remove the unessary burdons and limition created by finaincial
            and social status the world may just shine that much brighter. Stand
            with us as a united people under one God.
          </p>
        </div>
      </section>
      <section className={styles.projects} id="projects">
        <h1 className="whtTxt">Projects</h1>
        <div className={styles.projectContainer}>
          <div className="leftSide">
            <h2>Simple AI</h2>
            <span className="iconCircle">
              {" "}
              <FaHandHoldingUsd size={45} color="white" />{" "}
            </span>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam
            </p>
            <Link href="/thewebsite.com">
              <button className="navyBtn">Visit WebSite</button>
            </Link>
          </div>
          <span className={styles.line}></span>
          <div className="center">
            <h2>Bid Democracy</h2>
            <span className="iconCircle">
              {" "}
              <FaRegHandshake size={45} color="white" />{" "}
            </span>

            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam
            </p>
            <Link href="/thewebsite.com">
              <button className="navyBtn">Visit WebSite</button>
            </Link>
          </div>
          <span className={styles.line}></span>
          <div className="rightSide">
            <h2>Career Development</h2>
            <span className="iconCircle">
              {" "}
              <FaGraduationCap size={45} color="white" />{" "}
            </span>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam
            </p>
            <Link href="/thewebsite.com">
              <button className="navyBtn">Visit WebSite</button>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.donate} id="donate">
        <div className={styles.donateContainer}>
          <div className="leftSide greyLeftSide">
            <Image
              className={styles.donateImage}
              src="/education.jpeg"
              width={400}
              height={250}
              alt="random person"
            />
            <Image
              className={styles.donateImage}
              src="/housing.jpeg"
              width={400}
              height={250}
              alt="random person"
            />
            <Image
              className={styles.donateImage}
              src="/family.jpeg"
              width={400}
              height={250}
              alt="random person"
            />
          </div>
          <div className="rightSide rightSideRed">
            <h1>Donate</h1>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam Lorem ipsum dolor
              sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
              tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
              voluptua
            </p>
            <Link href="/donate">
              <button className="navyBtn">Create an Impact</button>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.volunteer} id="volunteer">
        <h1>
          Volunteer
          <Link href={`${pathname}#pagetop`}>
           <span><GrHome size={25} /></span> 
          </Link>
        </h1>
        <div className={styles.topSection}>
          <div className={styles.imageContainer}>
            <Image
              className="leftSide"
              src="/imagename"
              width={25}
              height={25}
              alt="random person"
            />
          </div>
          <div className="rightSide rightSideVolunteer">
            <h2>you can be a hero!</h2>
            <p>
              Volunteer today and join an amazing team of people that are
              changing the world!
            </p>
            <Link href="/">
              <button className="redBtn">Sign up</button>
            </Link>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <span>
            {" "}
            <FaRegCalendarCheck size={35} /> Events
          </span>
          <span>
            {" "}
            <FaPiggyBank size={35} /> Fundraising
          </span>
          <span>
            {" "}
            <FaBookReader size={35} /> Tutoring
          </span>
          <span>
            {" "}
            <BiBuildingHouse size={35} /> Community Development
          </span>
          <span>
            {" "}
            <HiLightBulb size={35} /> And So Much More!
          </span>
        </div>
      </section>
      <section className={styles.careers} id="careers">
        <h1>Careers</h1>
        <div className={styles.careerTop}>
          <Card title="Web Development" iconName={<MdComputer size={50}/>}>
            <ul>
              <li>Web Design</li>
              <li>Web Development</li>
              <li>UX/UI</li>
              <li>Web Maintenance</li>
            </ul>
          </Card>
          <Card title="Grant Writing" iconName={<TfiWrite size={45}/>}>
            <ul>
              <li>Grant Research</li>
              <li>Grant Writing</li>
              <li>Financial Planning</li>
              <li>Project Management</li>
            </ul>
          </Card>
          <Card title="Staff Member" iconName={<BsBriefcaseFill size={45}/>}>
            <ul>
              <li>Office Positions</li>
              <li>Teaching Positions</li>
              <li>Admin Positions</li>
              <li>Marketing Positions</li>
            </ul>
          </Card>
        </div>
        <div className={styles.careerBottom}>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam{" "}
          </p>
          <Link href="/">
            <button className="redBtn">Apply Today</button>
          </Link>
        </div>
      </section>
      <section className={styles.resources} id="resources">
        <div className={styles.resourcesLeft}>
          <h1 className="whtTxt">resources</h1>
          <p className="whtTxt">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam{" "}
          </p>
        </div>
        <section className={styles.resourceList}>
       
          <h3>Links to Outside Resources</h3>
          <ul>
            <li>
              <Link href="/">SNAP</Link>
            </li>
            <li>
              <Link href="/">WIC</Link>
            </li>
            <li>
              <Link href="/">HUD</Link>
            </li>
            <li>
              <Link href="/">Medicaid</Link>
            </li>
            <li>
              <Link href="/">FASFA</Link>
            </li>
          </ul>
        </section>
        <Link className="homeLinkWht" href={`${pathname}#pagetop`}>
            <GrHome size={25} />
          </Link>
      </section>
      <section className={styles.footer}>
        <Footer />
      </section>
    </main>
  );
}
