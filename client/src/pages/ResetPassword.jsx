import { useState } from "react";
import "../assets/global.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Forgotpassword() {
  const [newPassword, setnewPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`${data.message}`);
        localStorage.removeItem("email");
        navigate("/auth?mode=signin");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>🔒Reset Password</h2>

        <div className="input-group">
          <label>Passwrod</label>
          <input
            type="password"
            placeholder="Enter password..."
            value={newPassword}
            onChange={(e) => {
              setnewPassword(e.target.value);
            }}
          />
        </div>

        <button className="login-btn" type="submit">
          Set Password
        </button>
      </form>
    </div>
  );
}
