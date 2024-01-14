import { BsBriefcaseFill } from "react-icons/bs";
import { MdComputer } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";

const Careers = () => {
  return (
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
  );
};
export default Careers;
