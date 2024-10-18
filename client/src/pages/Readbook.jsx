import React, { useEffect, useState } from "react";
import PreviewBook from "../components/PreviewBookStore";
import NavBar from "../components/NavBar";
import { getbookbyID } from "../API/createbook";
<<<<<<< Updated upstream
import { useParams ,useNavigate} from "react-router-dom"; 
import { notify } from "../store/utils/notify";
=======
// <<<<<<< Updated upstream
import { useParams, useNavigate } from "react-router-dom";
import { notify } from "../store/utils/notify";
// // =======
// import { useParams } from "react-router-dom";
// import Footer from "../components/Footer";
// // >>>>>>> Stashed changes
>>>>>>> Stashed changes
const chapter = [
    {
        "title": "Quantum Theory Basics",
        "summary": "<p>An introduction to the core principles of quantum mechanics.<br></p>",
        "components": [
            {
                "type": "Text",
                "id": 1728453684007,
                "content": "<p>Quantum mechanics explains the behavior of particles on the atomic scale.<br></p>"
            },
            {
                "type": "Equation",
                "id": 1728453826441,
                "content": "Schrödinger Equation: iħ∂Ψ/∂t = HΨ"
            }
        ]
    }
]
export default function Readbook() {
<<<<<<< Updated upstream
    const navigate = useNavigate();
    const { bookID } = useParams(); 
    const [book, setBook] = useState(null); 
    useEffect(() => {
        const fetchBook = async () => {
            if (bookID) {
                const fetchedBook = await getbookbyID(bookID); 
                setBook(fetchedBook); 
                if(!fetchedBook){
                    notify("Book not found")
                    navigate('/bookStore')
                }
            }
        };
        fetchBook();
    }, [bookID]); 

    return (
        <>
            <NavBar />
            {book ? (
                <PreviewBook chapters={book.chapters}  bookinfo = {book}/> 
            ) : (
                <p>Loading book data...</p> 
            )}
        </>
    );
}
=======
  // <<<<<<< Updated upstream
  const navigate = useNavigate();
  const { bookID } = useParams();
  const [book, setBook] = useState(null);
  useEffect(() => {
    const fetchBook = async () => {
      if (bookID) {
        const fetchedBook = await getbookbyID(bookID);
        setBook(fetchedBook);
        if (!fetchedBook) {
          notify("Book not found");
          navigate("/bookStore");
        }
      }
    };
    fetchBook();
  }, [bookID]);

  return (
    <>
      <NavBar />
      {book ? (
        <PreviewBook chapters={book.chapters} bookinfo={book} />
      ) : (
        <p>Loading book data...</p>
      )}
    </>
  );
  // =======
  // const { bookID } = useParams();
  // const [book, setBook] = useState(null);
  // useEffect(() => {
  //   const fetchBook = async () => {
  //     if (bookID) {
  //       const fetchedBook = await getbookbyID(bookID);
  //       setBook(fetchedBook);
  //     }
  //   };
  //   fetchBook();
  // }, [bookID]);

  // return (
  //   <>
  //     <NavBar />
  //     {book ? (
  //       <PreviewBook chapters={book.chapters} />
  //     ) : (
  //       <p>Loading book data...</p>
  //     )}
  //     <Footer />
  //   </>
  // );
  // >>>>>>> Stashed changes
}
>>>>>>> Stashed changes
