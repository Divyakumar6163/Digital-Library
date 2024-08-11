import React from "react";
import img1 from "../image/heroImg1.png";
const Carousel = () => {
  return (
    <section className="relative w-full">
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
      >
        {/* Carousel wrapper */}
        <div className="relative h-100 overflow-hidden rounded-lg md:h-96 ">
          {/* Item 1 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <div className="relative w-full h-full">
              <img
                src={img1}
                className="absolute block h-full object-cover"
                style={{ width: "100vw", height: "100vh" }}
                alt="Slide 1"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50">
                <h2 className="text-2xl font-bold">Welcome to Slide 1</h2>
                <p className="mt-2">Discover the features of our service.</p>
                <a
                  href="/learn-more"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
          {/* Item 2 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <div className="relative w-full h-full">
              <img
                src={img1}
                className="absolute block w-full h-full object-cover"
                alt="Slide 2"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50">
                <h2 className="text-2xl font-bold">Welcome to Slide 2</h2>
                <p className="mt-2">Explore our latest updates.</p>
                <a
                  href="/explore"
                  className="mt-4 inline-block px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>
          {/* Item 3 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <div className="relative w-full h-full">
              <img
                src={img1}
                className="absolute block w-full h-full object-cover"
                alt="Slide 3"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50">
                <h2 className="text-2xl font-bold">Welcome to Slide 3</h2>
                <p className="mt-2">Check out our new features.</p>
                <a
                  href="/features"
                  className="mt-4 inline-block px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Check Features
                </a>
              </div>
            </div>
          </div>
          {/* Item 4 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <div className="relative w-full h-full">
              <img
                src={img1}
                className="absolute block w-full h-full object-cover"
                alt="Slide 4"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50">
                <h2 className="text-2xl font-bold">Welcome to Slide 4</h2>
                <p className="mt-2">Learn more about our offerings.</p>
                <a
                  href="/offerings"
                  className="mt-4 inline-block px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
                >
                  Our Offerings
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Slider indicators */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          <button
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current="true"
            aria-label="Slide 1"
            data-carousel-slide-to="0"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 2"
            data-carousel-slide-to="1"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 3"
            data-carousel-slide-to="2"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 4"
            data-carousel-slide-to="3"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 5"
            data-carousel-slide-to="4"
          ></button>
        </div>
        {/* Slider controls */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </section>
  );
};

export default Carousel;
