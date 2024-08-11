import NavBar from "./components/navBar";
import DataCard from "./components/DataCard";
import About from "./components/About";
// import Login from "./components/Login";
// import SignUpPage from "./components/SignUp";
import ContactForm from "./components/ContactUs";
function App() {
  return (
    <div>
      <NavBar />
      {/* <Login /> */}
      {/* <SignUpPage /> */}
      <About />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
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
    </div>
  );
}

export default App;
