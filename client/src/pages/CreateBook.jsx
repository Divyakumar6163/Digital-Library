import NavBar from "../components/NavBar";
import CreateBookStore from "../components/CreateBookStore";
import CreateBookIntro from "../components/CreateBookIntro";
import Footer from "../components/Footer";
import { useState } from "react";
const CreateBook = () => {
  const [isIntro, setIsIntro] = useState(true);
  return (
    <>
      <NavBar />
      {isIntro && <CreateBookIntro setIsIntro={setIsIntro} />}
      {!isIntro && <CreateBookStore setIsIntro={setIsIntro} />}
      <Footer />
    </>
  );
};
export default CreateBook;
