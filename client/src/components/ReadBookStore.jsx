import React from "react";
import BookCover1 from "../image/BookCover1.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import styles from "./ReadBookStore.module.css";
// Sample data object
// const DUMMY_DATA = {
//   card1: {
//     img: BookCover1,
//     title: "Noteworthy India",
//     description:
//       "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
//     path: "/",
//   },
//   card2: {
//     img: BookCover1,
//     title: "Noteworthy technology acquisitions 2021",
//     description:
//       "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
//     path: "/",
//   },
//   card3: {
//     img: BookCover1,
//     title: "Noteworthy technology acquisitions 2021",
//     description:
//       "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
//     path: "/",
//   },
//   card4: {
//     img: BookCover1,
//     title: "Noteworthy technology acquisitions 2021",
//     description:
//       "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
//     path: "/",
//   },
//   card5: {
//     img: BookCover1,
//     title: "Noteworthy technology acquisitions 2021",
//     description:
//       "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
//     path: "/",
//   },
//   card6: {
//     img: BookCover1,
//     title: "Noteworthy technology acquisitions 2021",
//     description:
//       "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
//     path: "/",
//   },
//   card7: {
//     img: BookCover1,
//     title: "Noteworthy technology acquisitions 2021",
//     description:
//       "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
//     path: "/",
//   },
//   card8: {
//     img: BookCover1,
//     title: "Noteworthy technology acquisitions 2021",
//     description:
//       "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
//     path: "/",
//   },
// };

// Functional component to display the cards
const ReadBookStore = ({ heading }) => {
  const navigate = useNavigate();
  const AllBooks = useSelector((state) => state.books.allbooks);
  const Filteredbooks = useSelector((state) => state.books.filteredbooks);
  function handleReadMore() {
    navigate("/book/1");
  }
  return (
    <div className="mb-20">
      <h4
        className="mb-4 mx-6 my-20 text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white"
        id={styles.cardReadHeading}
      >
        {heading}
      </h4>
      <div className="flex overflow-x-auto space-x-4 p-4">
        {Object.keys(Filteredbooks).length <= 0 && (
          <p className="text-center text-gray-500 font-semibold my-4">
            No Book Available
          </p>
        )}
        {Object.keys(Filteredbooks).length > 0 &&
          Object.values(Filteredbooks)
            .slice(0, 7)
            .map((data, idx) => (
              <div
                key={idx}
                id={styles.cardReadDiv}
                className="min-w-[290px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <div
                  className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                  id={styles.cardReadImg}
                >
                  <a href="/" className="block h-full w-full">
                    <img
                      className="object-cover w-full h-full rounded-t-lg"
                      src={BookCover1}
                      alt={data.booktitle}
                    />
                  </a>
                </div>
                <div className="p-5">
                  <a href="/">
                    <h5
                      className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2"
                      id={styles.cardReadTitle}
                    >
                      {data.description}
                    </h5>
                  </a>
                  <p
                    onClick={handleReadMore}
                    style={{ cursor: "pointer" }}
                    id={styles.cardReadp}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ReadBookStore;
