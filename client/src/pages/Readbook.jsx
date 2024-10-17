import React, { useEffect, useState } from "react";
import PreviewBook from "../components/PreviewBookStore";
import NavBar from "../components/NavBar";
import { getbookbyID } from "../API/createbook";
import { useParams ,useNavigate} from "react-router-dom"; 
import { notify } from "../store/utils/notify";

export default function Readbook() {
    const navigate = useNavigate();
    const { bookID } = useParams(); 
    const [book, setBook] = useState(null); 

    useEffect(() => {
        const fetchBook = async () => {
            try {
                if (bookID) {
                    const fetchedBook = await getbookbyID(bookID); 
                    setBook(fetchedBook); 
                    if (!fetchedBook) {
                        notify("Book not found");
                        navigate('/bookStore');
                    }
                }
            } catch (error) {
                notify("An error occurred while fetching the book.");
                navigate('/bookStore');
            }
        };
        fetchBook();
    }, [bookID, navigate]);

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
