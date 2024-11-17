import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { store } from "./../store/store";
import * as useractions from "./../store/actions/userinfoactions";
import * as authactions from "./../store/actions/authactions";
import * as bookactions from "./../store/actions/bookactions";
import * as bookinfoactions from "./../store/actions/bookinfoactions";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Logo from "../image/Logo.png";
import styles from "./NavBar.module.css";
import { useSelector } from "react-redux";
import { ToLink } from "../App";
import axios from "axios";
import { notify } from "../store/utils/notify";

const adminMail = [
  "divyakumar768800@gmail.com",
  "pushkargupta063@gmail.com",
  "22me02037@iitbbs.ac.in",
];

export default function NavBar1() {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  // const [searchBooks, setSearchBooks] = useState([]);
  const userState = useSelector((state) => state.user);
  const islogin = useSelector((state) => state.user.islogin);
  const username = useSelector((state) => state.user.userinfo.name);
  const profile = useSelector((state) => state.user.userinfo.profileImage);

  // Set isAdmin only when userState.userinfo.emailid changes
  useEffect(() => {
    setIsAdmin(adminMail.includes(userState.userinfo.emailid));
  }, [userState.userinfo.emailid]);

  const handleIsSearch = () => {
    setIsSearch(!isSearch);
  };

  const handleSignOut = () => {
    store.dispatch(useractions.setlogin(false));
    store.dispatch(useractions.setuserinfo({}));
    store.dispatch(authactions.setAccessToken(null));
    store.dispatch(authactions.setRefreshToken(null));
    store.dispatch(bookactions.setBookDetails(null));
  };

  const handleSearch = async () => {
    console.log(search);
    if (search.trim() === "") {
      notify("Please enter a search");
      return;
    }

    try {
      const res = await axios.get(`${ToLink}/search`, {
        params: { search },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate("/searchBooks");
      // setSearchBooks(res.data.data.books);
      store.dispatch(bookinfoactions.setSearchBooks(res.data.data.books));
      console.log(res.data.data.books); // Log books
    } catch (error) {
      console.error(
        "Error searching for books:",
        error.response?.data?.message || error.message
      );
    }
  };

  function handleProfile() {
    navigate("/profile");
  }

  function handlePremium() {
    navigate("/premium");
  }

  function handleBooks() {
    navigate("/yourBooks");
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent default behavior for Enter/Done
                  handleSearch();
                }
              }}
              className="w-full px-3 py-2 pl-10 text-sm text-white placeholder-gray-500 bg-gray-800 border border-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-white "
              placeholder="Search..."
            />
            <FaSearch
              id={styles.seachIcon}
              className="absolute w-5 h-5 text-gray-500 left-3 top-2.5"
              style={{ marginLeft: "8px", cursor: "pointer" }}
            />
          </div>
        )}
        <div
          className="relative w-56"
          style={{ marginRight: "2px" }}
          id={styles.seachBar1}
        >
          <input
            id={styles.seachInput1}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }} // Trigger handleSearch on Enter key press
            className="w-full-[20px] px-3 py-2 pl-10 text-sm text-white placeholder-gray-500 bg-gray-800 border border-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-white "
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
        {islogin ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img={profile} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{username}</span>
              <span className="block truncate text-sm font-medium">
                {userState.userinfo.emailid}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
            <Dropdown.Item onClick={handlePremium}>Premium</Dropdown.Item>
            <Dropdown.Item onClick={handleBooks}>Your Books</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : null}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link style={{ color: "white" }}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link style={{ color: "white" }}>
          <Link to="/bookStore">Read Books</Link>
        </Navbar.Link>
        <Navbar.Link href="/createBook" style={{ color: "white" }}>
          <NavLink to="/createBook">Create Books</NavLink>
        </Navbar.Link>
        {isAdmin && (
          <Navbar.Link style={{ color: "white" }}>
            <Link to="/adminStore">Publish Books</Link>
          </Navbar.Link>
        )}
        <Navbar.Link style={{ color: "white" }}>
          {!islogin ? <Link to="/login">SignUp/Login</Link> : null}
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
