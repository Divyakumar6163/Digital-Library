import React, { useState } from "react";
import BookCover1 from "../image/BookCover1.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { MdWorkspacePremium } from "react-icons/md";
import styles from "./ReadBookStore.module.css";
import { FiArrowRightCircle } from "react-icons/fi";
import Pageloader from "../store/utils/pageloader";
import { notify } from "../store/utils/notify";
import PremiumImage from "./../image/premium.jpg";

const ReadBookStore = ({ heading, books }) => {
  const navigate = useNavigate();
  const Filteredbooks = books;
  const [visibleBooks, setVisibleBooks] = useState(7);
  const [hoveredBook, setHoveredBook] = useState(null);
  const isuser = useSelector((state) => state.user);

  function handleReadMore(data) {
    if (!isuser.islogin) {
      notify("Please login first");
      return;
    }
    if (data.booktype === "Premium") {
      notify("Please purchase a membership to access this book");
      return;
    } else {
      navigate(`/readbook/${data._id}`);
    }
  }

  function handleUpdateBook(data) {
    if (!isuser.islogin) {
      notify("Please login first");
      return;
    }
    navigate(`/updatebook/${data._id}`);
  }

  const loadMoreBooks = () => {
    setVisibleBooks((prev) => prev + 7);
  };

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
            .slice(0, visibleBooks)
            .map((data, idx) => (
              <div
                key={idx}
                id={styles.cardReadDiv}
                className="min-w-[290px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <div
                  className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center "
                  id={styles.cardReadImg}
                  onMouseEnter={() =>
                    data.booktype === "Premium" && setHoveredBook(idx)
                  }
                  onMouseLeave={() => setHoveredBook(null)}
                >
                  <a className="block h-full w-full">
                    <img
                      className={`object-cover w-full h-full rounded-t-lg ${
                        data.booktype === "Premium" ? "cursor-not-allowed" : ""
                      }`}
                      src={
                        hoveredBook === idx && data.booktype === "Premium"
                          ? PremiumImage
                          : data.image
                          ? data.image
                          : BookCover1
                      }
                      alt={data.booktitle}
                    />
                  </a>
                </div>
                <div className="p-5">
                  <a>
                    <h5
                      className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2"
                      id={styles.cardReadTitle}
                      dangerouslySetInnerHTML={{ __html: data.booktitle }}
                    />
                  </a>
                  <div className="flex space-x-2">
                    {data.ispublished === null && (
                      <button
                        onClick={() => handleUpdateBook(data)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        style={{ cursor: "pointer" }}
                      >
                        Update
                      </button>
                    )}
                    <button
                      onClick={() => handleReadMore(data)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      id={styles.cardReadp}
                      style={{ cursor: "pointer" }}
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
                    </button>
                  </div>
                </div>
              </div>
            ))}
        {visibleBooks < Object.keys(Filteredbooks).length && (
          <div className="flex justify-center">
            <button
              onClick={loadMoreBooks}
              className="px-3 py-2 text-whitefocus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <FiArrowRightCircle className="h-16 w-16 text-black" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadBookStore;
