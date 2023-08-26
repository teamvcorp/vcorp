"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import Navigation from "./components/nav";
import Card from "./components/Card";
import Footer from "./components/Footer";
import { BiBuildingHouse } from "react-icons/bi";
import { BsBriefcaseFill, BsFillArrowUpSquareFill } from "react-icons/bs";

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
  const [readMoreState, setUseMoreState] = useState({
    paragraphOne: false,
    paragraphTwo: false,
  });
  // const handleSetState = (name, value) => {
  //   setUseMoreState({ ...readMoreState, [name]: value });
  // };

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
            Imagine a world where living is uncomplicated, where essentials are
            readily available and opportunities constantly emerge. Haven't you
            ever wished you'd known something sooner, thinking how different
            things could've been? At the Von Der Becke Academy, we aim to bridge
            that gap. Our programs address housing, health and fitness, food
            sustainability, educational opportunities, and social inclusion. We
            firmly believe every individual has a unique and positive
            contribution awaiting the world. By eliminating barriers tied to
            financial and social status, we can unveil a brighter, more united
            future. Join us in our mission to unite humanity and illuminate the
            world's potential.
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
              We champion support based on effort, not on credit or income
              status. Every family is guaranteed housing, utilities, and food,
              as we strive to eradicate debilitating stressors. Our vision is a
              world where you have room to breathe, live, and thrive
              irrespective of earnings.
              {readMoreState.paragraphOne ? (
                <p>
                  With programs tailored to grow alongside you, we're committed
                  to helping every individual reach their pinnacle of potential.
                  Together, let's shape a world where effort and passion are the
                  true measures of success.
                </p>
              ) : (
                <></>
              )}
              <button
                className="readMore"
                onClick={() =>
                  setUseMoreState({
                    ...readMoreState,
                    paragraphOne: !readMoreState.paragraphOne,
                  })
                }
              >
                {readMoreState.paragraphOne ? "See Less..." : "See More..."}
              </button>
            </p>
            <Link href="https://www.simpleai.club/">
              <button className="navyBtn">Visit WebSite</button>
            </Link>
          </div>
          <span className={styles.line}></span>
          <div className="center">
            <h2>Democracy</h2>
            <span className="iconCircle">
              {" "}
              <FaRegHandshake size={45} color="white" />{" "}
            </span>

            <p>
              Empowering individuals directly, we amplify the might of every
              dollar. By unlocking human potential, we drive profound community
              transformation. We champion change by dismantling political
              obstacles and sidestepping divisive barriers. Join us in reshaping
              a world where everyone's power is realized and every dollar
              counts.
            </p>
            <Link href="https://www.biddemocracy.com/">
              <button className="navyBtn">Visit WebSite</button>
            </Link>
          </div>
          <span className={styles.line}></span>
          <div className="rightSide">
            <h2>T.R.I.P</h2>
            <span className="iconCircle">
              {" "}
              <FaGraduationCap size={45} color="white" />{" "}
            </span>
            <p>
              We're committed to fostering communities that embody leadership,
              unity, and self-sufficiency. Through compassionate actions, we
              exemplify and teach the ethos of servant leadership. Our
              forward-thinking programs are meticulously crafted to future-proof
              our youth, ensuring a resilient tomorrow.
              {readMoreState.paragraphTwo ? (
                <p>
                  At the heart of our mission is guiding each individual,
                  believing that from singular growth springs societal progress.
                  Join us in sculpting a united and self-sustaining future.
                </p>
              ) : (
                <></>
              )}
              <button
                className="readMore"
                onClick={() =>
                  setUseMoreState({
                    ...readMoreState,
                    paragraphTwo: !readMoreState.paragraphTwo,
                  })
                }
              >
                {readMoreState.paragraphTwo ? "See Less..." : "See More..."}
              </button>
            </p>
            <Link href="https://www.taekwondostormlake.com/program/trip">
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
            <h1>Ways to Impact</h1>
            <p>
              Every penny contributed to VAcorp fuels the innovation and
              endurance of our transformative projects. Choose to donate
              anonymously or stand proudly with recognition—either way, you're
              forging the path for the next generation of leaders in this
              magnificent country. Together, we're stepping up to ease the
              weight on our government's shoulders, championing solutions to
              society's pressing challenges. Be the change. Shape the future
              with VAcorp.
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
          <div className="homeLink">
            <Link href={`${pathname}#pagetop`}>
              <BsFillArrowUpSquareFill size={50} />
              <p className="homeLinkP">Top</p>
            </Link>
          </div>
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
              Volunteer today and be part
              of a dedicated team striving for political change and progress.
              Whether you're an experienced professional advocating for reform
              or an enthusiastic individual eager to contribute to our cause,
              your efforts can make a difference. If you believe in building a
              brighter future for our nation, join us.
            </p>
            <Link href="/">
              <button className="redBtn">Get more info </button>
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
          <Card title="Web Development" iconName={<MdComputer size={50} />}>
            <ul>
              <li>Web Design</li>
              <li>Web Development</li>
              <li>UX/UI</li>
              <li>Web Maintenance</li>
            </ul>
          </Card>
          <Card title="Grant Writing" iconName={<TfiWrite size={45} />}>
            <ul>
              <li>Grant Research</li>
              <li>Grant Writing</li>
              <li>Financial Planning</li>
              <li>Project Management</li>
            </ul>
          </Card>
          <Card title="Staff Member" iconName={<BsBriefcaseFill size={45} />}>
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
            You could wait until we are a company associated with positve change
            or you coudl help us make it.
          </p>
          <Link href="/">
            <button className="redBtn" disabled>
              Apply Today
            </button>
          </Link>
        </div>
      </section>
      {/* <section className={styles.resources} id="resources">
        <h1 className="whtTxt">resources</h1>
        <div className={styles.resourcesContainer}>
          <div className={styles.resourcesLeft}>
            <p className="whtTxt">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam{" "}
            </p>
          </div>
          <section className={styles.resourceList}>
            <p className="whtTxt">
              <i>Links to Outside Resources</i>{" "}
            </p>
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
        </div>
      </section> */}
      <section className={styles.footer}>
        <Footer />
      </section>
    </main>
  );
}
