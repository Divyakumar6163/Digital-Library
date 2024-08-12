import Carousel from "./Carousel";
import NavBar from "./NavBar";
import DataCard from "./DataCard";
import About from "./About";
import Footer from "./Footer";
import ContactForm from "./ContactUs";
import styles from "./HeroPage.module.css";
export default function HeroPage() {
  return (
    <>
      <NavBar />
      <Carousel />
      <About />
      <div className={styles.card}>
        <DataCard
          heading="500+ Users Used"
          para="Over 500 users have actively embraced our technology solutions this year, showcasing widespread engagement and satisfaction."
        />
        <DataCard
          heading="300+ Books Published"
          para="We proudly celebrated the publication of 300+ books, reflecting our commitment to advancing knowledge and thought leadership in the industry."
        />
        <DataCard
          heading="50+ Membership"
          para="Our network expanded significantly with 50+ new memberships, highlighting our growing influence and community connections."
        />
      </div>
      <ContactForm />
      <Footer />
    </>
  );
}
