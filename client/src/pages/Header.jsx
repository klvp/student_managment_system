import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteCookie, getCookie } from "../lib/helper";

const Header = () => {
  const [loggedin, setLoggedin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (getCookie("token")) {
      setLoggedin(true);
    }
  }, []);
  const handleLogout = () => {
    deleteCookie("token");
    window.location.href = "/login";
  };
  return (
    <header className="fixed top-0 left-0 w-5/5 bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link to="/dashboard" className="text-lg font-bold">
          Dashboard
        </Link>
        <div>
          {loggedin && (
            <>
              <Link to="/add" className="mr-4">
                Add Student
              </Link>
              <button onClick={handleLogout} className="mr-4">
                Logout
              </button>
            </>
          )}
          {!loggedin && (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
