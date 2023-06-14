import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

import Navigation from "./components/nav";
import Card from "./components/Card";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <Navigation />
      </section>
      <section className={styles.about}>
        <h1>About</h1>
        {/* <h1 className={styles.red}>ABout red</h1> */}
        <h2>Von Der Becke Academy Corp </h2>
        <h3>Mission Statement</h3>
        <p>
          Enabling transformative change through the power of education,
          compassion, and innovative problem-solving.
        </p>
        <p>
          Image a world where you could just live, were things you need to
          survive are just there for you and opportunity is always knocking. I
          bet you can recal a day that you have said something like, "Man if I
          only knew, things would be different!". We aim to help you achieve
          that our programs look to solve problems like housing, health and
          fitness, food sustainability, educational disparities, and social
          inclusion. The Von Der Becke academy feels strongly that each
          individual has somthing postive to contribut to our society and if we
          remove the unessary burdons and limition created by finaincial and
          social status the world may just shine that much brighter. Stand with
          us as a united people under one God.
        </p>
      </section>
      <section className={styles.projects}>
        <div className={styles.projectContainer}>
          <div className="leftSide">
            <h2>Simple AI</h2>
            <Image src="/imagename.jpeg" width="25" height="25"></Image>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam
            </p>
            <Link href="/thewebsite.com">
              <button>Visit WebSite</button>
            </Link>
          </div>
          <div className="center">
            <h2>Bid Democracy</h2>
            <Image src="/imagename.jpeg" width="25" height="25"></Image>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam
            </p>
            <Link href="/thewebsite.com">
              <button>Visit WebSite</button>
            </Link>
          </div>
          <div className="rightSide">
            <h2>Career Development</h2>
            <Image src="/imagename.jpeg" width="25" height="25"></Image>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam
            </p>
            <Link href="/thewebsite.com">
              <button>Visit WebSite</button>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.donate}>
        <div className={styles.donateContainer}>
          <div className="leftSide">
            <Image src="/imagename.jpeg" width={25} height={25}></Image>
            <Image src="/imagename.jpeg" width={25} height={25}></Image>
            <Image src="/imagename.jpeg" width={25} height={25}></Image>
          </div>
          <div className="rightSide">
            <h1>Donate</h1>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam Lorem ipsum dolor
              sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
              tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
              voluptua
            </p>
            <Link href="/">
              <button>Create and Impact</button>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.volunteer}>
        <h1>Volunteer</h1>
        <div className={styles.topSection}>
          <image
            className="rightSide"
            src="/imagename"
            width={25}
            height={25}
          ></image>
          <div className="leftSide">
            <h2>you can be a hero!</h2>
            <p>
              Volunteer today and join an amazing team of people that are
              changing the world!
            </p>
            <Link href="/">
              <button>Become a Volunteer</button>
            </Link>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <span>Events</span>
          <span>Fundraising</span>
          <span>Tutoring</span>
          <span>Community Development</span>
          <span>And So Much More!</span>
        </div>
      </section>
      <section className={styles.careers}>
        <h1>Careers</h1>
        <div className={styles.careerTop}>
          <Card title="Web Development" iconName="">
            <ul>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
            </ul>
          </Card>
          <Card title="Grant Writing" iconName="">
            <ul>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
            </ul>
          </Card>
          <Card title="Staff Member" iconName="">
            <ul>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
              <li>Web Stuff</li>
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
            <button>Apply Today</button>
          </Link>
        </div>
      </section>
      <section className={styles.resources}>
        <div className={styles.resourcesLeft}>
          <h1>resources</h1>
          <p>
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
      </section>
      <section className={styles.footer}>
        <Footer />
      </section>
    </main>
  );
}
