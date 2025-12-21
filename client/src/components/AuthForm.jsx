import { useState } from "react";
import "../assets/global.css";
import { NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { setToken } from "../utils/auth";

export default function AuthForm() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "signin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      alert("Email and Password are required");
      return;
    }
    const postData = {
      email,
      password,
    };

    const link = isLogin ? "/signin" : "/signup";

    const response = await fetch(`${import.meta.env.VITE_URL}${link}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`${data.message}`);
      console.log("Response Data:", data);
      if (isLogin) {
        setToken(data.token);
        setUser(data.result);
        navigate("/");
      } else {
        navigate("/auth?mode=signin");
      }
    } else if (response.status === 401) {
      alert(`${data.message}`);
    } else {
      setError(data.message || "Something Wrong...");
      console.log(data.message);

      alert(`${error}`);
      console.log("Failed to signin");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>🔒{isLogin ? "Signin" : "Sign Up"}</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className=" input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" type="submit">
          {isLogin ? "Signin" : "Sign Up"}
        </button>

        {isLogin ? (
          <p className="signup-text">
            Don't have an account?{" "}
            <NavLink to="/auth?mode=signup">Sign Up</NavLink>
            <br />
            <NavLink to="/forgotpassword">Forgot Password</NavLink>
          </p>
        ) : (
          <p className="signin-text">
            Already have an account?{" "}
            <NavLink to="/auth?mode=signin">Sign In</NavLink>
          </p>
        )}
      </form>
    </div>
  );
}
