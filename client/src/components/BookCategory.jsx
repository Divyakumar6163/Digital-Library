import React from "react";
import BookCover1 from "../image/BookCover1.png";
import styles from "./BookCategory.module.css";
import { useNavigate } from "react-router";
const DUMMY_DATA = {
  card1: {
    img: BookCover1,
    title: "Noteworthy India",
    description:
      "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    path: "/",
  },
  card2: {
    img: BookCover1,
    title: "Noteworthy technology acquisitions 2021",
    description:
      "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    path: "/",
  },
  card3: {
    img: BookCover1,
    title: "Noteworthy technology acquisitions 2021",
    description:
      "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    path: "/",
  },
  card4: {
    img: BookCover1,
    title: "Noteworthy technology acquisitions 2021",
    description:
      "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    path: "/",
  },
  card5: {
    img: BookCover1,
    title: "Noteworthy technology acquisitions 2021",
    description:
      "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    path: "/",
  },
  card6: {
    img: BookCover1,
    title: "Noteworthy technology acquisitions 2021",
    description:
      "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    path: "/",
  },
  card7: {
    img: BookCover1,
    title: "Noteworthy technology acquisitions 2021",
    description:
      "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    path: "/",
  },
  card8: {
    img: BookCover1,
    title: "Noteworthy technology acquisitions 2021",
    description:
      "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    path: "/",
  },
};
function BookCategory() {
  const navigate = useNavigate();
  function handleReadMore() {
    navigate("/book/1");
  }
  return (
    <div className="flex justify-center">
      {" "}
      {/* Center the main div */}
      <div
        className={`flex flex-wrap gap-10 p-4 justify-start ml-10 my-20 ${styles.cardCatMainDiv}`}
        // className="container flex flex-wrap gap-5 ml-auto p-4"
        // The content inside will start from the start of the container
      >
        {Object.keys(DUMMY_DATA).length > 0 &&
          Object.values(DUMMY_DATA).map((data, idx) => (
            <div
              key={idx}
              id={styles.cardCatDiv}
              className="flex-grow-0 flex-shrink-0 w-[300px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div
                id={styles.cardCatImg}
                className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <a href="/" className="block h-full w-full">
                  <img
                    id={styles.cardCatImg}
                    className="object-cover w-full h-full rounded-t-lg"
                    src={data.img}
                    alt={data.title}
                  />
                </a>
              </div>
              <div className="p-5" id={styles.cardCatDes}>
                <a href="/">
                  <h5
                    id={styles.cardCatTitle}
                    className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1"
                  >
                    {data.title}
                  </h5>
                </a>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={handleReadMore}
                  id={styles.cardCatp}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                  <svg
                    id={styles.cardCatArrow}
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
}

export default BookCategory;
