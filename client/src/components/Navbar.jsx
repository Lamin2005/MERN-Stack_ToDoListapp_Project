import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/global.css";
import { useUser } from "../context/userContext";
import { getToken, removeToken } from "../utils/auth";
import { useEffect } from "react";

function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useUser();
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const response = await fetch(`${import.meta.env.VITE_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.result);
      } else {
        console.log("Fail to get Profile...");
      }
    };

    getProfile();
  }, []);

  const Signout = async () => {
    removeToken();
    alert("Signout Successfully....");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <h2 className="logo">To Do List App</h2>

        <ul className={open ? "nav-links open" : "nav-links"}>
          <li>
            <NavLink to="/" className="link">
              Home
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/profile" className="link">
                  Profile
                </NavLink>
              </li>
              <li>
                <button
                  style={{
                    color: "white",
                    border: "10px",
                    fontSize: "1.1rem",
                    padding: "0.5rem",
                    backgroundColor: "crimson",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={Signout}
                >
                  Signout
                </button>
              </li>
            </>
          )}

          {!user && (
            <>
              <li>
                <NavLink to="/auth?mode=signin" className="link">
                  Signin
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="menu-icon" onClick={() => setOpen(!open)}>
          <div className={open ? "bar rotate1" : "bar"}></div>
          <div className={open ? "bar hide" : "bar"}></div>
          <div className={open ? "bar rotate2" : "bar"}></div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
