import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Logo from "../image/Logo.png";
import styles from "./NavBar.module.css";
export default function NavBar1() {
  const [isSearch, setIsSearch] = useState(false);
  const handleIsSearch = () => {
    setIsSearch(!isSearch);
  };
  function handleSearch() {
    // Implement your search logic here
  }
  return (
    <Navbar fluid style={{ backgroundColor: "black" }}>
      <Navbar.Brand href="/">
        <img src={Logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Digi Library
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 z-50" id="seachDiv">
        {isSearch && (
          <div
            className="relative w-56"
            style={{ marginRight: "3vw" }}
            id={styles.seachBar}
          >
            <input
              id={styles.seachInput}
              type="text"
              className="w-full px-3 py-2 pl-10 text-sm text-white placeholder-gray-500 bg-gray-800 border border-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-white "
              //   style={{ borderColor: "white" }}
              placeholder="Search..."
            />
            <FaSearch
              id={styles.seachIcon}
              className="absolute w-5 h-5 text-gray-500 left-3 top-2.5"
              style={{ marginLeft: "8px", cursor: "pointer" }}
              onClick={handleSearch}
            />
          </div>
        )}
        <div
          className="relative w-56"
          // style={{ marginRight: "3vw" }}
          id={styles.seachBar1}
        >
          <input
            id={styles.seachInput1}
            type="text"
            className="w-full-[20px] px-3 py-2 pl-10 text-sm text-white placeholder-gray-500 bg-gray-800 border border-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-white "
            //   style={{ borderColor: "white" }}
            placeholder="Search..."
          />
          <FaSearch
            id={styles.seachIcon1}
            className="absolute w-5 h-5 text-gray-500 left-3 top-2.5"
            style={{ marginLeft: "8px", cursor: "pointer" }}
            onClick={handleSearch}
          />
        </div>
        {isSearch && (
          <ImCross
            id={styles.crossIcon}
            className="absolute w-3 h-3 text-gray-500 right-3 top-2.5"
            style={{ top: "22px", left: "94vw", cursor: "pointer" }}
            onClick={handleIsSearch}
          />
        )}
        {!isSearch && (
          <FaSearch
            id={styles.searchIconOutter}
            className="absolute w-5 h-5 text-gray-500 left-0 top-2.5"
            style={{ top: "20px", left: "93vw", cursor: "pointer" }}
            onClick={handleIsSearch}
          />
        )}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link style={{ color: "white" }}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        {/* <Navbar.Link style={{ color: "white" }}>
          <NavLink to="#about">About</NavLink>
        </Navbar.Link> */}
        <Navbar.Link style={{ color: "white" }}>
          <Link to="/bookStore">Read Books</Link>
        </Navbar.Link>
        <Navbar.Link href="/createBook" style={{ color: "white" }}>
          <NavLink to="/createBook">Create Books</NavLink>
        </Navbar.Link>
        <Navbar.Link style={{ color: "white" }}>
          <Link to="/login">SignUp/Login</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
