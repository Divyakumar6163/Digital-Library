import React, { useEffect, useState } from "react";
import PreviewBook from "../components/PreviewBookStore";
import NavBar from "../components/NavBar";
import { getbookbyID } from "../API/createbook";
import { useParams ,useNavigate} from "react-router-dom"; 
import { notify } from "../store/utils/notify";
import Pageloader from "../store/utils/pageloader";
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
                <PreviewBook chapters={book.chapters}  bookinfo = {book} ispre={false}/> 
            ) : (
                <div className="flex justify-around"><Pageloader/></div>
            )}
        </>
    );
}
