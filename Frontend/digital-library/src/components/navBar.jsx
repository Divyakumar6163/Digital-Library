import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
export default function NavBar() {
  const [isSearch, setIsSearch] = useState(false);
  const handleIsSearch = () => {
    setIsSearch(!isSearch);
  };
  function handleSearch() {
    // Implement your search logic here
  }
  return (
    <Navbar fluid rounded style={{ backgroundColor: "black" }}>
      <NavbarBrand href="#">
        {/* <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Digi Library
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        {isSearch && (
          <div className="relative w-56" style={{ marginRight: "3vw" }}>
            <input
              type="text"
              className="w-full px-3 py-2 pl-10 text-sm text-white placeholder-gray-500 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-white focus:border-white active:border-white"
              //   style={{ borderColor: "white" }}
              placeholder="Search..."
            />
            <FaSearch
              className="absolute w-5 h-5 text-gray-500 left-3 top-2.5"
              style={{ marginLeft: "8px", cursor: "pointer" }}
              onClick={handleSearch}
            />
          </div>
        )}
        {isSearch && (
          <ImCross
            className="absolute w-3 h-3 text-gray-500 right-3 top-2.5"
            style={{ top: "22px", left: "94vw", cursor: "pointer" }}
            onClick={handleIsSearch}
          />
        )}
        {!isSearch && (
          <FaSearch
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
          <DropdownHeader>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
            </span>
          </DropdownHeader>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem>Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="#" active>
          About
        </NavbarLink>
        <NavbarLink href="#" active>
          Read Books
        </NavbarLink>
        <NavbarLink href="#" active>
          Create Book
        </NavbarLink>
        <NavbarLink href="#" active>
          Contact
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
