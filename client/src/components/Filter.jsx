import React, { useState } from "react";
import { useSelector } from "react-redux";
function Filter() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const resultObject = useSelector((state) => state.books.alltags);

  // const resultObject = alltags.reduce((obj, [key, value]) => {
  //   obj[key] = {
  //     value: value, 
  //     isSelected: false,
  //   };
  //   return obj;
  // }, {});
console.log(resultObject);
const [categories, setCategories] = useState(resultObject);
console.log(categories)
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCheckboxChange = (event) => {
    setCategories({
      ...categories,
      [event.target.id]: event.target.checked,
    });
  };
  function handleApply() {
    // Apply filter here
    toggleDropdown();
  }
  return (
    <div className="relative flex justify-end my-5 mx-4">
      <button
        id="dropdownDefault"
        onClick={toggleDropdown}
        style={{ backgroundColor: "#2563EB", border: "none" }}
        className="text-white bg-primary-blue hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        type="button"
      >
        Filter
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          id="dropdown"
          className="absolute mt-2 w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
          style={{ top: "100%", right: "0" }}
        >
          <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            Category
          </h6>
          <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
            {Object.entries(categories).map(([key, value]) => (
              <li className="flex items-center" key={key}>
                <input
                  id={key}
                  type="checkbox"
                  checked={value.isSelected}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor={key}
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} 
                </label>
              </li>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleApply}
                style={{
                  backgroundColor: "#2563EB",
                  border: "blue",
                  display: "flex",
                  justifySelf: "flex-end",
                }}
                className="text-white bg-primary-blue hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center flex items-end dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 justify-end align-baseline"
              >
                Apply
              </button>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Filter;
